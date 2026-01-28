package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gofrs/uuid"
)

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshResponse struct {
	Success bool `json:"success"`
	Data    struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		ExpiresIn   int    `json:"expires_in"`
	} `json:"data"`
}

func AuthRefresh(c buffalo.Context) error {
	var req RefreshRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	if req.RefreshToken == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Refresh token is required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	// Validar el JWT del refresh token
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(req.RefreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired refresh token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Verificar que sea un refresh token
	if claims.TokenType != "refresh" {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token type",
			ErrorCode: "INVALID_TOKEN_TYPE",
		}))
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

	// Verificar que la sesión exista y no esté revocada
	refreshTokenHash := sha256Hex(req.RefreshToken)
	var session models.Session
	err = tx.Where("refresh_token_hash = ? AND revoked = ?", refreshTokenHash, false).First(&session)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Session not found or revoked",
			ErrorCode: "SESSION_INVALID",
		}))
	}

	// Verificar que la sesión no haya expirado
	if time.Now().UTC().After(session.ExpiresAt) {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Session expired",
			ErrorCode: "SESSION_EXPIRED",
		}))
	}

	// Obtener usuario
	userID, err := uuid.FromString(claims.UserID)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	var user models.User
	if err := tx.Find(&user, userID); err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	// Verificar que el usuario esté activo
	if !user.Active {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Account is deactivated",
			ErrorCode: "ACCOUNT_INACTIVE",
		}))
	}

	// Generar nuevo access token
	accessToken, err := generateToken(user, "access", AccessTokenDuration)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate access token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Actualizar last_activity_at de la sesión
	session.LastActivityAt = time.Now().UTC()
	tx.Update(&session)

	// Respuesta
	var resp RefreshResponse
	resp.Success = true
	resp.Data.AccessToken = accessToken
	resp.Data.TokenType = "Bearer"
	resp.Data.ExpiresIn = int(AccessTokenDuration.Seconds())

	return c.Render(http.StatusOK, r.JSON(resp))
}