// server/actions/auth_sessions_revoke.go

package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
)

func AuthSessionsRevoke(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	sessionIDParam := c.Param("session_id")
	if sessionIDParam == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Session ID is required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	sessionID, err := uuid.FromString(sessionIDParam)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid session ID",
			ErrorCode: "INVALID_SESSION_ID",
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

	var session models.Session
	err = tx.Where("id = ? AND user_id = ?", sessionID, user.ID).First(&session)
	if err != nil {
		return c.Render(http.StatusNotFound, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Session not found",
			ErrorCode: "SESSION_NOT_FOUND",
		}))
	}

	if session.Revoked {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Session is already revoked",
			ErrorCode: "ALREADY_REVOKED",
		}))
	}

	session.Revoked = true
	now := time.Now().UTC()
	session.RevokedAt = &now

	if err := tx.Update(&session); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to revoke session",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": "Session revoked successfully",
	}))
}
