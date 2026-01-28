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

// -- Enable 2FA - Step 2: Verify and Activate

type Verify2FAEnableRequest struct {
	SetupToken string `json:"setup_token"`
	Code       string `json:"code"`
}

type Verify2FAEnableResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func Auth2FAVerifyEnable(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
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

	// Buscar setup token
	setupTokenHash := sha256Hex(req.SetupToken)
	var vt models.VerificationToken
	err := tx.Where("token_hash = ? AND token_type = ? AND used = ? AND user_id = ?",
		setupTokenHash, "2fa_setup", false, user.ID).First(&vt)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired setup token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Verificar expiración
	if time.Now().UTC().After(vt.ExpiresAt) {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Setup token has expired",
			ErrorCode: "TOKEN_EXPIRED",
		}))
	}

	// Extraer secret y backup codes del campo Email
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

	// Validar código TOTP
	valid := totp.Validate(req.Code, secret)
	if !valid {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid verification code",
			ErrorCode: "INVALID_CODE",
		}))
	}

	// Activar 2FA en el usuario
	user.TwoFactorEnabled = true
	user.TwoFactorSecret = &secret
	if err := tx.Update(user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to enable 2FA",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Guardar backup codes hasheados
	for _, code := range backupCodes {
		codeHash := sha256Hex(strings.ReplaceAll(code, "-", ""))
		backupCode := models.TwoFactorBackupCode{
			UserID:   user.ID,
			CodeHash: codeHash,
			Used:     false,
		}
		tx.Create(&backupCode)
	}

	// Marcar setup token como usado
	vt.Used = true
	now := time.Now().UTC()
	vt.UsedAt = &now
	tx.Update(&vt)

	return c.Render(http.StatusOK, r.JSON(Verify2FAEnableResponse{
		Success: true,
		Message: "Two-factor authentication enabled successfully",
	}))
}
