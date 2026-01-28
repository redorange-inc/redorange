package actions

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image/png"
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/pquerna/otp/totp"
	"github.com/skip2/go-qrcode"
)

const (
	TOTPIssuer       = "RedOrange" // Nombre de tu app
	BackupCodesCount = 10
)

// -- enable 2FA - Step 1: Get QR Code
type Enable2FAResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Secret      string   `json:"secret"`
		QRCode      string   `json:"qr_code"`
		SetupToken  string   `json:"setup_token"`
		BackupCodes []string `json:"backup_codes"`
	} `json:"data"`
}

func Auth2FAEnable(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	// Verificar si ya tiene 2FA habilitado
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

	// Generar TOTP key
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      TOTPIssuer,
		AccountName: user.Email,
	})
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate 2FA secret",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Generar QR code
	qrCode, err := qrcode.New(key.URL(), qrcode.Medium)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate QR code",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	var qrBuf bytes.Buffer
	err = png.Encode(&qrBuf, qrCode.Image(256))
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to encode QR code",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}
	qrBase64 := "data:image/png;base64," + base64.StdEncoding.EncodeToString(qrBuf.Bytes())

	// Generar backup codes
	backupCodes := make([]string, BackupCodesCount)
	for i := 0; i < BackupCodesCount; i++ {
		backupCodes[i] = generateBackupCode()
	}

	// Crear setup token (para verificar en el paso 2)
	setupToken, err := randomToken(32)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate setup token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}
	setupTokenHash := sha256Hex(setupToken)

	// Guardar verification token con el secret TOTP y backup codes
	// Usamos el campo Email para guardar datos temporales (secret|backupCodes)
	tempData := key.Secret() + "|" + strings.Join(backupCodes, ",")

	vt := models.VerificationToken{
		UserID:    &user.ID,
		Email:     &tempData, // Guardamos secret y backup codes temporalmente
		TokenHash: setupTokenHash,
		TokenType: "2fa_setup",
		ExpiresAt: time.Now().UTC().Add(10 * time.Minute),
		Used:      false,
	}

	if err := tx.Create(&vt); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create setup token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Respuesta
	var resp Enable2FAResponse
	resp.Success = true
	resp.Data.Secret = key.Secret()
	resp.Data.QRCode = qrBase64
	resp.Data.SetupToken = setupToken
	resp.Data.BackupCodes = backupCodes

	return c.Render(http.StatusOK, r.JSON(resp))
}

// generateBackupCode genera un código de respaldo en formato XXXX-XXXX
func generateBackupCode() string {
	token, _ := randomToken(4) // 8 caracteres hex
	upper := strings.ToUpper(token)
	return fmt.Sprintf("%s-%s", upper[:4], upper[4:])
}
