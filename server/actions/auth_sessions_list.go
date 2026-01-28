package actions

import (
	"encoding/json"
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Get Active Sessions

type SessionInfo struct {
	ID             string          `json:"id"`
	DeviceInfo     json.RawMessage `json:"device_info"`
	CreatedAt      time.Time       `json:"created_at"`
	LastActivityAt time.Time       `json:"last_activity_at"`
	Current        bool            `json:"current"`
}

type GetSessionsResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Sessions []SessionInfo `json:"sessions"`
	} `json:"data"`
}

func AuthSessionsList(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
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

	// Obtener el refresh token actual del header para identificar sesión actual
	claims := GetClaims(c)
	currentSessionID := ""
	if claims != nil {
		// Buscar sesión actual por user_id y que no esté revocada
		var currentSession models.Session
		err := tx.Where("user_id = ? AND revoked = ? AND expires_at > ?",
			user.ID, false, time.Now().UTC()).Order("last_activity_at DESC").First(&currentSession)
		if err == nil {
			currentSessionID = currentSession.ID.String()
		}
	}

	// Obtener todas las sesiones activas del usuario
	var sessions []models.Session
	err := tx.Where("user_id = ? AND revoked = ? AND expires_at > ?",
		user.ID, false, time.Now().UTC()).Order("last_activity_at DESC").All(&sessions)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to get sessions",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Construir respuesta
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

	var resp GetSessionsResponse
	resp.Success = true
	resp.Data.Sessions = sessionInfos

	return c.Render(http.StatusOK, r.JSON(resp))
}
