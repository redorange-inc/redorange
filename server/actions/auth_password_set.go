package actions

import (
	"net/http"
	"strings"

	"github.com/alexedwards/argon2id"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Set Password (OAuth users)

type SetPasswordRequest struct {
	Password string `json:"password"`
}

type SetPasswordResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func AuthPasswordSet(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req SetPasswordRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Password = strings.TrimSpace(req.Password)

	// Validar
	if len(req.Password) < 8 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Password must be at least 8 characters",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	// Verificar que NO tenga password (solo OAuth users)
	if user.PasswordHash != nil && *user.PasswordHash != "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Password already set. Use change password endpoint instead.",
			ErrorCode: "PASSWORD_ALREADY_SET",
		}))
	}

	// Hashear contraseña
	pwHash, err := argon2id.CreateHash(req.Password, argon2id.DefaultParams)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to set password",
			ErrorCode: "INTERNAL_ERROR",
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

	// Actualizar password
	user.PasswordHash = &pwHash
	if err := tx.Update(user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to set password",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(SetPasswordResponse{
		Success: true,
		Message: "Password set successfully",
	}))
}
