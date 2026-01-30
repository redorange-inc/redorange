package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

const (
	AccessTokenDuration  = 15 * time.Minute
	RefreshTokenDuration = 7 * 24 * time.Hour
	TempTokenDuration    = 5 * time.Minute
	MaxLoginAttempts     = 5
	LockDuration         = 15 * time.Minute
)

var JWTSecret = []byte("your-secret-key-change-in-production")

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	TokenType    string    `json:"token_type"`
	ExpiresIn    int       `json:"expires_in"`
	User         LoginUser `json:"user"`
}

type LoginUser struct {
	ID               string  `json:"id"`
	Email            string  `json:"email"`
	Name             string  `json:"name"`
	LastName         string  `json:"last_name"`
	Profile          *string `json:"profile,omitempty"`
	Role             string  `json:"role"`
	TwoFactorEnabled bool    `json:"two_factor_enabled"`
}

type Login2FAResponse struct {
	TempToken string `json:"temp_token"`
	Message   string `json:"message"`
}

func AuthLogin(c buffalo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	if req.Email == "" || req.Password == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Email and password are required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

	var user models.User
	err := tx.Where("email = ?", req.Email).First(&user)
	if err != nil {
		recordLoginAttempt(tx, nil, req.Email, false, "user_not_found", c.Request())
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid email or password",
			ErrorCode: "INVALID_CREDENTIALS",
		}))
	}

	var accountLock models.AccountLock
	err = tx.Where("user_id = ?", user.ID).First(&accountLock)
	if err == nil && time.Now().UTC().Before(accountLock.LockedUntil) {
		return c.Render(http.StatusLocked, r.JSON(map[string]interface{}{
			"success":      false,
			"error":        "Account temporarily locked due to multiple failed attempts",
			"error_code":   "ACCOUNT_LOCKED",
			"locked_until": accountLock.LockedUntil,
		}))
	}

	if user.PasswordHash == nil || !verifyPassword(req.Password, *user.PasswordHash) {
		recordLoginAttempt(tx, &user.ID, req.Email, false, "invalid_password", c.Request())
		checkAndLockAccount(tx, user.ID)
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid email or password",
			ErrorCode: "INVALID_CREDENTIALS",
		}))
	}

	if !user.Active {
		recordLoginAttempt(tx, &user.ID, req.Email, false, "account_inactive", c.Request())
		return c.Render(http.StatusForbidden, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Account is inactive",
			ErrorCode: "ACCOUNT_INACTIVE",
		}))
	}

	clearAccountLock(tx, user.ID)
	recordLoginAttempt(tx, &user.ID, req.Email, true, "", c.Request())

	if user.TwoFactorEnabled {
		tempToken, err := generateToken(user, "temp_2fa", TempTokenDuration)
		if err != nil {
			return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Failed to generate token",
				ErrorCode: "TOKEN_GENERATION_FAILED",
			}))
		}

		return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
			"success":      true,
			"requires_2fa": true,
			"data": Login2FAResponse{
				TempToken: tempToken,
				Message:   "Please provide 2FA code",
			},
		}))
	}

	return generateAndReturnTokens(c, tx, user)
}

func generateAndReturnTokens(c buffalo.Context, tx *pop.Connection, user models.User) error {
	accessToken, refreshToken, err := createSession(tx, user, c.Request())
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create session",
			ErrorCode: "SESSION_CREATE_FAILED",
		}))
	}

	now := time.Now().UTC()
	user.LastLoginAt = &now
	tx.Update(&user)

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": LoginResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			TokenType:    "Bearer",
			ExpiresIn:    int(AccessTokenDuration.Seconds()),
			User: LoginUser{
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
