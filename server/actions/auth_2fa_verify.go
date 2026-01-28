package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"github.com/pquerna/otp/totp"
)

const (
	Max2FAAttempts = 3
)

// -- Verify 2FA Code (During Login)

type Verify2FARequest struct {
	TempToken string `json:"temp_token"`
	Code      string `json:"code"`
}

type Verify2FAResponse struct {
	Success bool `json:"success"`
	Data    struct {
		AccessToken  string    `json:"access_token"`
		RefreshToken string    `json:"refresh_token"`
		TokenType    string    `json:"token_type"`
		ExpiresIn    int       `json:"expires_in"`
		User         LoginUser `json:"user"`
	} `json:"data"`
}

type Verify2FAErrorResponse struct {
	Success           bool   `json:"success"`
	Error             string `json:"error"`
	ErrorCode         string `json:"error_code"`
	AttemptsRemaining int    `json:"attempts_remaining,omitempty"`
}

func Auth2FAVerify(c buffalo.Context) error {
	var req Verify2FARequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.TempToken = strings.TrimSpace(req.TempToken)
	req.Code = strings.TrimSpace(req.Code)

	if req.TempToken == "" || req.Code == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Temp token and code are required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	// Validar el JWT del temp token
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(req.TempToken, claims, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired temp token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Verificar que sea un temp_2fa token
	if claims.TokenType != "temp_2fa" {
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

	// Verificar que tenga 2FA habilitado y secret
	if !user.TwoFactorEnabled || user.TwoFactorSecret == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "2FA is not enabled for this user",
			ErrorCode: "2FA_NOT_ENABLED",
		}))
	}

	// Contar intentos fallidos recientes de 2FA
	var failedAttempts int
	since := time.Now().UTC().Add(-5 * time.Minute)
	tx.RawQuery(`
		SELECT COUNT(*) FROM auth.login_attempts 
		WHERE user_id = ? AND success = false AND failure_reason = '2fa_failed' AND created_at > ?
	`, user.ID, since).First(&failedAttempts)

	if failedAttempts >= Max2FAAttempts {
		return c.Render(http.StatusTooManyRequests, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Too many failed 2FA attempts. Please try again later.",
			ErrorCode: "TOO_MANY_ATTEMPTS",
		}))
	}

	// Validar código TOTP
	valid := totp.Validate(req.Code, *user.TwoFactorSecret)
	if !valid {
		// Registrar intento fallido
		logLoginAttempt(tx, user.Email, &user.ID, false, "2fa_failed", c)

		attemptsRemaining := Max2FAAttempts - failedAttempts - 1
		if attemptsRemaining < 0 {
			attemptsRemaining = 0
		}

		return c.Render(http.StatusBadRequest, r.JSON(Verify2FAErrorResponse{
			Success:           false,
			Error:             "Invalid 2FA code",
			ErrorCode:         "INVALID_CODE",
			AttemptsRemaining: attemptsRemaining,
		}))
	}

	// 2FA válido - generar tokens
	accessToken, err := generateToken(user, "access", AccessTokenDuration)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate access token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	refreshToken, err := generateToken(user, "refresh", RefreshTokenDuration)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate refresh token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Guardar sesión
	if err := createSession(tx, user.ID, refreshToken, c); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create session",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Actualizar last_login_at
	now := time.Now().UTC()
	user.LastLoginAt = &now
	tx.Update(&user)

	// Registrar login exitoso
	logLoginAttempt(tx, user.Email, &user.ID, true, "", c)

	// Respuesta
	var resp Verify2FAResponse
	resp.Success = true
	resp.Data.AccessToken = accessToken
	resp.Data.RefreshToken = refreshToken
	resp.Data.TokenType = "Bearer"
	resp.Data.ExpiresIn = int(AccessTokenDuration.Seconds())
	resp.Data.User = LoginUser{
		ID:               user.ID.String(),
		Email:            user.Email,
		FirstName:        user.FirstName,
		LastNamePaternal: user.LastNamePaternal,
		Role:             user.Role,
		TwoFactorEnabled: user.TwoFactorEnabled,
	}

	return c.Render(http.StatusOK, r.JSON(resp))
}