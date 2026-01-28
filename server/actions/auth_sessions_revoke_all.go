package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Revoke All Sessions

type RevokeAllSessionsRequest struct {
	IncludeCurrent bool `json:"include_current"`
}

type RevokeAllSessionsResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		RevokedCount int `json:"revoked_count"`
	} `json:"data"`
}

func AuthSessionsRevokeAll(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req RevokeAllSessionsRequest
	// Si no hay body, usa valores por defecto
	c.Bind(&req)

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

	now := time.Now().UTC()
	var revokedCount int

	if req.IncludeCurrent {
		// Revocar TODAS las sesiones
		result, err := tx.RawQuery(`
			UPDATE auth.sessions 
			SET revoked = true, revoked_at = ? 
			WHERE user_id = ? AND revoked = false
		`, now, user.ID).ExecWithCount()
		if err != nil {
			return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Failed to revoke sessions",
				ErrorCode: "INTERNAL_ERROR",
			}))
		}
		revokedCount = result
	} else {
		// Obtener la sesión actual (la más reciente activa)
		var currentSession models.Session
		err := tx.Where("user_id = ? AND revoked = ? AND expires_at > ?",
			user.ID, false, now).Order("last_activity_at DESC").First(&currentSession)

		if err != nil {
			// No hay sesión actual, revocar todas
			result, err := tx.RawQuery(`
				UPDATE auth.sessions 
				SET revoked = true, revoked_at = ? 
				WHERE user_id = ? AND revoked = false
			`, now, user.ID).ExecWithCount()
			if err != nil {
				return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
					Success:   false,
					Error:     "Failed to revoke sessions",
					ErrorCode: "INTERNAL_ERROR",
				}))
			}
			revokedCount = result
		} else {
			// Revocar todas excepto la actual
			result, err := tx.RawQuery(`
				UPDATE auth.sessions 
				SET revoked = true, revoked_at = ? 
				WHERE user_id = ? AND revoked = false AND id != ?
			`, now, user.ID, currentSession.ID).ExecWithCount()
			if err != nil {
				return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
					Success:   false,
					Error:     "Failed to revoke sessions",
					ErrorCode: "INTERNAL_ERROR",
				}))
			}
			revokedCount = result
		}
	}

	var resp RevokeAllSessionsResponse
	resp.Success = true
	if req.IncludeCurrent {
		resp.Message = "All sessions revoked successfully"
	} else {
		resp.Message = "All other sessions revoked successfully"
	}
	resp.Data.RevokedCount = revokedCount

	return c.Render(http.StatusOK, r.JSON(resp))
}
