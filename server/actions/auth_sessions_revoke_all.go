package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type RevokeAllSessionsRequest struct {
	IncludeCurrent bool `json:"include_current"`
}

func AuthSessionsRevokeAll(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req RevokeAllSessionsRequest
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
		var currentSession models.Session
		err := tx.Where("user_id = ? AND revoked = ? AND expires_at > ?",
			user.ID, false, now).Order("last_activity_at DESC").First(&currentSession)

		if err != nil {
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

	message := "All other sessions revoked successfully"
	if req.IncludeCurrent {
		message = "All sessions revoked successfully"
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": message,
		"data": map[string]interface{}{
			"revoked_count": revokedCount,
		},
	}))
}
