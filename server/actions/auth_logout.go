package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type LogoutResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func AuthLogout(c buffalo.Context) error {
	var req LogoutRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	if req.RefreshToken == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Refresh token is required",
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

	refreshTokenHash := sha256Hex(req.RefreshToken)

	var session models.Session
	err := tx.Where("refresh_token_hash = ? AND revoked = ?", refreshTokenHash, false).First(&session)
	if err != nil {
		return c.Render(http.StatusOK, r.JSON(LogoutResponse{
			Success: true,
			Message: "Logged out successfully",
		}))
	}

	session.Revoked = true
	now := time.Now().UTC()
	session.RevokedAt = &now

	if err := tx.Update(&session); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to logout",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(LogoutResponse{
		Success: true,
		Message: "Logged out successfully",
	}))
}