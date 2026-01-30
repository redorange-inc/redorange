package actions

import (
	"encoding/json"
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type SessionInfo struct {
	ID             string          `json:"id"`
	DeviceInfo     json.RawMessage `json:"device_info"`
	CreatedAt      time.Time       `json:"created_at"`
	LastActivityAt time.Time       `json:"last_activity_at"`
	Current        bool            `json:"current"`
}

func AuthSessionsList(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
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

	// Identificar sesión actual por la más reciente actividad
	currentSessionID := ""
	var currentSession models.Session
	err = tx.Where("user_id = ? AND revoked = ? AND expires_at > ?",
		user.ID, false, time.Now().UTC()).Order("last_activity_at DESC").First(&currentSession)
	if err == nil {
		currentSessionID = currentSession.ID.String()
	}

	var sessions []models.Session
	err = tx.Where("user_id = ? AND revoked = ? AND expires_at > ?",
		user.ID, false, time.Now().UTC()).Order("last_activity_at DESC").All(&sessions)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to get sessions",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	sessionInfos := make([]SessionInfo, len(sessions))
	for i, session := range sessions {
		sessionInfos[i] = SessionInfo{
			ID:             session.ID.String(),
			DeviceInfo:     session.DeviceInfo,
			CreatedAt:      session.CreatedAt,
			LastActivityAt: session.LastActivityAt,
			Current:        session.ID.String() == currentSessionID,
		}
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"sessions": sessionInfos,
		},
	}))
}
