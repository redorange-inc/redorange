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

type Verify2FAEnableRequest struct {
	SetupToken string `json:"setup_token"`
	Code       string `json:"code"`
}

func Auth2FAVerifyEnable(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req Verify2FAEnableRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.SetupToken = strings.TrimSpace(req.SetupToken)
	req.Code = strings.TrimSpace(req.Code)

	if req.SetupToken == "" || req.Code == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Setup token and code are required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	if user.TwoFactorEnabled {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Two-factor authentication is already enabled",
			ErrorCode: "2FA_ALREADY_ENABLED",
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

	setupTokenHash := sha256Hex(req.SetupToken)
	var vt models.VerificationToken
	err = tx.Where("token_hash = ? AND token_type = ? AND used = ? AND user_id = ?",
		setupTokenHash, "2fa_setup", false, user.ID).First(&vt)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired setup token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	if time.Now().UTC().After(vt.ExpiresAt) {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Setup token has expired",
			ErrorCode: "TOKEN_EXPIRED",
		}))
	}

	if vt.Email == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid setup token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	parts := strings.Split(*vt.Email, "|")
	if len(parts) != 2 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid setup token data",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	secret := parts[0]
	backupCodesStr := parts[1]
	backupCodes := strings.Split(backupCodesStr, ",")

	valid := totp.Validate(req.Code, secret)
	if !valid {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid verification code",
			ErrorCode: "INVALID_CODE",
		}))
	}

	user.TwoFactorEnabled = true
	user.TwoFactorSecret = &secret
	if err := tx.Update(&user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to enable 2FA",
			ErrorCode: "INTERNAL_ERROR",
		}))
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

	vt.Used = true
	now := time.Now().UTC()
	vt.UsedAt = &now
	tx.Update(&vt)

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": "Two-factor authentication enabled successfully",
	}))
}
