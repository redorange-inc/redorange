package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/alexedwards/argon2id"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- reset password
type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
}

type ResetPasswordResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func AuthResetPassword(c buffalo.Context) error {
	var req ResetPasswordRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Token = strings.TrimSpace(req.Token)

	// Validar
	details := map[string]any{}
	if req.Token == "" {
		details["token"] = "Token is required"
	}
	if len(req.NewPassword) < 8 {
		details["new_password"] = "Password must be at least 8 characters"
	}
	if len(details) > 0 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Validation error",
			ErrorCode: "VALIDATION_ERROR",
			Details:   details,
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

	// Buscar token
	tokenHash := sha256Hex(req.Token)
	var vt models.VerificationToken
	err := tx.Where("token_hash = ? AND token_type = ? AND used = ?", tokenHash, "password_reset", false).First(&vt)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Verificar expiración
	if time.Now().UTC().After(vt.ExpiresAt) {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Token has expired",
			ErrorCode: "TOKEN_EXPIRED",
		}))
	}

	// Verificar que tenga user_id
	if vt.UserID == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Obtener usuario
	var user models.User
	if err := tx.Find(&user, *vt.UserID); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	// Hashear nueva contraseña
	pwHash, err := argon2id.CreateHash(req.NewPassword, argon2id.DefaultParams)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to reset password",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Actualizar contraseña
	user.PasswordHash = &pwHash
	if err := tx.Update(&user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to reset password",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Marcar token como usado
	vt.Used = true
	now := time.Now().UTC()
	vt.UsedAt = &now
	tx.Update(&vt)

	// Revocar todas las sesiones del usuario (seguridad)
	tx.RawQuery(`
		UPDATE auth.sessions 
		SET revoked = true, revoked_at = NOW() 
		WHERE user_id = ? AND revoked = false
	`, user.ID).Exec()

	return c.Render(http.StatusOK, r.JSON(ResetPasswordResponse{
		Success: true,
		Message: "Password reset successfully",
	}))
}
