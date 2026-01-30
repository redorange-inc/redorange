package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/golang-jwt/jwt/v5"
)

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
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

	token, err := jwt.Parse(req.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid refresh token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token claims",
			ErrorCode: "INVALID_CLAIMS",
		}))
	}

	tokenType, _ := claims["token_type"].(string)
	if tokenType != "refresh" {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token type",
			ErrorCode: "INVALID_TOKEN_TYPE",
		}))
	}

	userID, _ := claims["user_id"].(string)

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

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

	if time.Now().UTC().After(session.ExpiresAt) {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Session expired",
			ErrorCode: "SESSION_EXPIRED",
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

	if !user.Active {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User account is inactive",
			ErrorCode: "USER_INACTIVE",
		}))
	}

	accessToken, err := generateToken(user, "access", AccessTokenDuration)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate access token",
			ErrorCode: "TOKEN_GENERATION_FAILED",
		}))
	}

	session.LastActivityAt = time.Now().UTC()
	tx.Update(&session)

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": RefreshResponse{
			AccessToken: accessToken,
			TokenType:   "Bearer",
			ExpiresIn:   int(AccessTokenDuration.Seconds()),
		},
	}))
}
