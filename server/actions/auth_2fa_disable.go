package actions

import (
	"net/http"
	"strings"

	"github.com/alexedwards/argon2id"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/pquerna/otp/totp"
)

// -- Disable 2FA

type Disable2FARequest struct {
	Password string `json:"password"`
	Code     string `json:"code"`
}

type Disable2FAResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func Auth2FADisable(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req Disable2FARequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Password = strings.TrimSpace(req.Password)
	req.Code = strings.TrimSpace(req.Code)

	if req.Password == "" || req.Code == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Password and 2FA code are required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	// Verificar que tenga 2FA habilitado
	if !user.TwoFactorEnabled {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Two-factor authentication is not enabled",
			ErrorCode: "2FA_NOT_ENABLED",
		}))
	}

	// Verificar que tenga password
	if user.PasswordHash == nil || *user.PasswordHash == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "No password set for this account",
			ErrorCode: "NO_PASSWORD",
		}))
	}

	// Verificar password
	match, err := argon2id.ComparePasswordAndHash(req.Password, *user.PasswordHash)
	if err != nil || !match {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid password",
			ErrorCode: "INVALID_PASSWORD",
		}))
	}

	// Verificar código TOTP
	if user.TwoFactorSecret == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "2FA secret not found",
			ErrorCode: "2FA_SECRET_NOT_FOUND",
		}))
	}

	valid := totp.Validate(req.Code, *user.TwoFactorSecret)
	if !valid {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid 2FA code",
			ErrorCode: "INVALID_CODE",
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

	// Deshabilitar 2FA
	user.TwoFactorEnabled = false
	user.TwoFactorSecret = nil
	if err := tx.Update(user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to disable 2FA",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Eliminar backup codes
	tx.RawQuery(`
		DELETE FROM auth.two_factor_backup_codes WHERE user_id = ?
	`, user.ID).Exec()

	return c.Render(http.StatusOK, r.JSON(Disable2FAResponse{
		Success: true,
		Message: "Two-factor authentication disabled",
	}))
}
