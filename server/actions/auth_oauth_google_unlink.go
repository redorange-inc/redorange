package actions

import (
	"net/http"
	"server/models"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type UnlinkGoogleRequest struct {
	Password string `json:"password"`
}

func AuthOAuthGoogleUnlink(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req UnlinkGoogleRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Password = strings.TrimSpace(req.Password)

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

	var oauthProvider models.OAuthProvider
	err = tx.Where("user_id = ? AND provider = ?", user.ID, "google").First(&oauthProvider)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Google account is not linked",
			ErrorCode: "NOT_LINKED",
		}))
	}

	hasPassword := user.PasswordHash != nil && *user.PasswordHash != ""

	var otherProviders int
	tx.RawQuery("SELECT COUNT(*) FROM auth.oauth_providers WHERE user_id = ? AND provider != 'google'", user.ID).First(&otherProviders)

	if !hasPassword && otherProviders == 0 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Cannot unlink Google account. Please set a password first.",
			ErrorCode: "NO_OTHER_AUTH_METHOD",
		}))
	}

	if hasPassword {
		if req.Password == "" {
			return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Password is required to unlink Google account",
				ErrorCode: "PASSWORD_REQUIRED",
			}))
		}

		if !verifyPassword(req.Password, *user.PasswordHash) {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid password",
				ErrorCode: "INVALID_PASSWORD",
			}))
		}
	}

	if err := tx.Destroy(&oauthProvider); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to unlink Google account",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": "Google account unlinked successfully",
	}))
}
