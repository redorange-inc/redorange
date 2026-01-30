// server/actions/auth_2fa_backup_status.go

package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type BackupCodesStatusResponse struct {
	TotalCodes     int `json:"total_codes"`
	UsedCodes      int `json:"used_codes"`
	RemainingCodes int `json:"remaining_codes"`
}

func Auth2FABackupStatus(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Unauthorized",
			ErrorCode: "UNAUTHORIZED",
		}))
	}

	if !user.TwoFactorEnabled {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Two-factor authentication is not enabled",
			ErrorCode: "2FA_NOT_ENABLED",
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

	var totalCodes int
	err = tx.RawQuery("SELECT COUNT(*) FROM auth.two_factor_backup_codes WHERE user_id = ?", user.ID).First(&totalCodes)
	if err != nil {
		totalCodes = 0
	}

	var usedCodes int
	err = tx.RawQuery("SELECT COUNT(*) FROM auth.two_factor_backup_codes WHERE user_id = ? AND used = true", user.ID).First(&usedCodes)
	if err != nil {
		usedCodes = 0
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": BackupCodesStatusResponse{
			TotalCodes:     totalCodes,
			UsedCodes:      usedCodes,
			RemainingCodes: totalCodes - usedCodes,
		},
	}))
}
