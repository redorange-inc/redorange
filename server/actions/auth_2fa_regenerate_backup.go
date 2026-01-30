package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/pquerna/otp/totp"
)

type RegenerateBackupCodesRequest struct {
	Code string `json:"code"`
}

func Auth2FARegenerateBackupCodes(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req RegenerateBackupCodesRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Code = strings.TrimSpace(req.Code)

	if req.Code == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "2FA code is required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	if !user.TwoFactorEnabled {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Two-factor authentication is not enabled",
			ErrorCode: "2FA_NOT_ENABLED",
		}))
	}

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

	tx.RawQuery("DELETE FROM auth.two_factor_backup_codes WHERE user_id = ?", user.ID).Exec()

	backupCodes := make([]string, BackupCodesCount)
	for i := 0; i < BackupCodesCount; i++ {
		backupCodes[i] = generateBackupCode()
	}

	for _, code := range backupCodes {
		codeHash := sha256Hex(strings.ReplaceAll(code, "-", ""))
		backupCode := models.TwoFactorBackupCode{
			UserID:    user.ID,
			CodeHash:  codeHash,
			Used:      false,
			CreatedAt: time.Now().UTC(),
		}
		tx.Create(&backupCode)
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"backup_codes": backupCodes,
		},
	}))
}
