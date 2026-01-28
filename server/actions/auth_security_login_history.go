package actions

import (
	"net/http"
	"server/models"
	"strconv"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Get Login History

type LoginAttemptInfo struct {
	ID            string    `json:"id"`
	Success       bool      `json:"success"`
	FailureReason *string   `json:"failure_reason,omitempty"`
	IPAddress     *string   `json:"ip_address,omitempty"`
	UserAgent     *string   `json:"user_agent,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
}

type LoginHistoryResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Total    int                `json:"total"`
		Limit    int                `json:"limit"`
		Offset   int                `json:"offset"`
		Attempts []LoginAttemptInfo `json:"attempts"`
	} `json:"data"`
}

func AuthSecurityLoginHistory(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	// Obtener query parameters
	limitStr := c.Param("limit")
	offsetStr := c.Param("offset")

	limit := 20
	offset := 0

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

	// Contar total de intentos
	var total int
	tx.RawQuery(`
		SELECT COUNT(*) FROM auth.login_attempts WHERE user_id = ?
	`, user.ID).First(&total)

	// Obtener intentos con paginación
	var attempts []models.LoginAttempt
	err := tx.RawQuery(`
		SELECT * FROM auth.login_attempts 
		WHERE user_id = ? 
		ORDER BY created_at DESC 
		LIMIT ? OFFSET ?
	`, user.ID, limit, offset).All(&attempts)

	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to get login history",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Construir respuesta
	attemptInfos := make([]LoginAttemptInfo, len(attempts))
	for i, attempt := range attempts {
		attemptInfos[i] = LoginAttemptInfo{
			ID:            attempt.ID.String(),
			Success:       attempt.Success,
			FailureReason: attempt.FailureReason,
			IPAddress:     attempt.IPAddress,
			UserAgent:     attempt.UserAgent,
			CreatedAt:     attempt.CreatedAt,
		}
	}

	var resp LoginHistoryResponse
	resp.Success = true
	resp.Data.Total = total
	resp.Data.Limit = limit
	resp.Data.Offset = offset
	resp.Data.Attempts = attemptInfos

	return c.Render(http.StatusOK, r.JSON(resp))
}
