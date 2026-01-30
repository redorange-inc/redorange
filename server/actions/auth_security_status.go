package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Check Account Status

type AccountStatusRequest struct {
	Email string `json:"email"`
}

type AccountStatusResponse struct {
	Success bool `json:"success"`
	Data    struct {
		IsLocked       bool       `json:"is_locked"`
		LockedUntil    *time.Time `json:"locked_until"`
		FailedAttempts int        `json:"failed_attempts"`
		Reason         *string    `json:"reason,omitempty"`
	} `json:"data"`
}

func AuthSecurityStatus(c buffalo.Context) error {
	var req AccountStatusRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Email == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Email is required",
			ErrorCode: "VALIDATION_ERROR",
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

	// Buscar usuario
	var user models.User
	err := tx.Where("email = ?", req.Email).First(&user)
	if err != nil {
		// Usuario no existe - devolver estado "no bloqueado" para evitar enumeración
		var resp AccountStatusResponse
		resp.Success = true
		resp.Data.IsLocked = false
		resp.Data.LockedUntil = nil
		resp.Data.FailedAttempts = 0
		return c.Render(http.StatusOK, r.JSON(resp))
	}

	// Verificar si hay bloqueo activo
	var lock models.AccountLock
	err = tx.Where("user_id = ?", user.ID).First(&lock)

	var resp AccountStatusResponse
	resp.Success = true

	if err == nil && time.Now().UTC().Before(lock.LockedUntil) {
		// Cuenta bloqueada
		resp.Data.IsLocked = true
		resp.Data.LockedUntil = &lock.LockedUntil
		resp.Data.Reason = lock.Reason

		// Contar intentos fallidos
		var failedAttempts int
		since := time.Now().UTC().Add(-LockDuration)
		tx.RawQuery(`
			SELECT COUNT(*) FROM auth.login_attempts 
			WHERE user_id = ? AND success = false AND created_at > ?
		`, user.ID, since).First(&failedAttempts)
		resp.Data.FailedAttempts = failedAttempts
	} else {
		// Cuenta no bloqueada
		resp.Data.IsLocked = false
		resp.Data.LockedUntil = nil

		// Contar intentos fallidos recientes
		var failedAttempts int
		since := time.Now().UTC().Add(-LockDuration)
		tx.RawQuery(`
			SELECT COUNT(*) FROM auth.login_attempts 
			WHERE user_id = ? AND success = false AND created_at > ?
		`, user.ID, since).First(&failedAttempts)
		resp.Data.FailedAttempts = failedAttempts
	}

	return c.Render(http.StatusOK, r.JSON(resp))
}
