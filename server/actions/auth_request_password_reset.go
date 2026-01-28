package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- request password reset
type RequestPasswordResetRequest struct {
	Email string `json:"email"`
}

type RequestPasswordResetResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func AuthRequestPasswordReset(c buffalo.Context) error {
	var req RequestPasswordResetRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Siempre devolver éxito para prevenir enumeración de emails
	successResponse := RequestPasswordResetResponse{
		Success: true,
		Message: "If the email exists, a password reset link has been sent",
	}

	if req.Email == "" {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	// Buscar usuario
	var user models.User
	err := tx.Where("email = ?", req.Email).First(&user)
	if err != nil {
		// Usuario no existe, pero devolvemos éxito
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	// Verificar que tenga password (no sea solo OAuth)
	if user.PasswordHash == nil || *user.PasswordHash == "" {
		// Usuario OAuth sin password, devolvemos éxito
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	// Invalidar tokens de reset anteriores
	tx.RawQuery(`
		UPDATE auth.verification_tokens 
		SET used = true, used_at = NOW() 
		WHERE user_id = ? AND token_type = ? AND used = false
	`, user.ID, "password_reset").Exec()

	// Crear token de reset
	rawToken, err := randomToken(32)
	if err != nil {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}
	tokenHash := sha256Hex(rawToken)

	vt := models.VerificationToken{
		UserID:    &user.ID,
		TokenHash: tokenHash,
		TokenType: "password_reset",
		ExpiresAt: time.Now().UTC().Add(1 * time.Hour), // 1 hora para reset
		Used:      false,
	}

	if err := tx.Create(&vt); err != nil {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	// TODO: Enviar email con rawToken
	// sendPasswordResetEmail(user.Email, rawToken)

	// En desarrollo, incluir token para testing
	if ENV == "development" {
		return c.Render(http.StatusOK, r.JSON(map[string]any{
			"success":                   true,
			"message":                   "If the email exists, a password reset link has been sent",
			"_dev_password_reset_token": rawToken,
		}))
	}

	return c.Render(http.StatusOK, r.JSON(successResponse))
}
