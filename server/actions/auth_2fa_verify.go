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

type Verify2FARequest struct {
	TempToken string `json:"temp_token"`
	Code      string `json:"code"`
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

	token, err := jwt.Parse(req.TempToken, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired temp token",
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
	if tokenType != "temp_2fa" {
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

	userIDStr, _ := claims["user_id"].(string)
	userID, err := uuid.FromString(userIDStr)
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

	if !user.TwoFactorEnabled || user.TwoFactorSecret == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "2FA is not enabled for this user",
			ErrorCode: "2FA_NOT_ENABLED",
		}))
	}

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

	valid := totp.Validate(req.Code, *user.TwoFactorSecret)
	if !valid {
		recordLoginAttempt(tx, &user.ID, user.Email, false, "2fa_failed", c.Request())

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

	accessToken, refreshToken, err := createSession(tx, user, c.Request())
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create session",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	now := time.Now().UTC()
	user.LastLoginAt = &now
	tx.Update(&user)

	recordLoginAttempt(tx, &user.ID, user.Email, true, "", c.Request())

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"token_type":    "Bearer",
			"expires_in":    int(AccessTokenDuration.Seconds()),
			"user": LoginUser{
				ID:               user.ID.String(),
				Email:            user.Email,
				Name:             user.Name,
				LastName:         user.LastName,
				Profile:          user.Profile,
				Role:             user.Role,
				TwoFactorEnabled: user.TwoFactorEnabled,
			},
		},
	}))
}
