package actions

import (
	"net/http"
	"server/models"
	"strings"

	"github.com/alexedwards/argon2id"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Unlink Google Account

type UnlinkGoogleRequest struct {
	Password string `json:"password"`
}

type UnlinkGoogleResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func AuthOAuthGoogleUnlink(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
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

	// Verificar si tiene Google vinculado
	var oauthProvider models.OAuthProvider
	err := tx.Where("user_id = ? AND provider = ?", user.ID, "google").First(&oauthProvider)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Google account is not linked",
			ErrorCode: "NOT_LINKED",
		}))
	}

	// Verificar que tenga otra forma de autenticación (password u otro OAuth)
	hasPassword := user.PasswordHash != nil && *user.PasswordHash != ""

	var otherProviders int
	tx.RawQuery(`
		SELECT COUNT(*) FROM auth.oauth_providers 
		WHERE user_id = ? AND provider != 'google'
	`, user.ID).First(&otherProviders)

	if !hasPassword && otherProviders == 0 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Cannot unlink Google account. Please set a password first.",
			ErrorCode: "NO_OTHER_AUTH_METHOD",
		}))
	}

	// Si tiene password, verificarlo
	if hasPassword {
		if req.Password == "" {
			return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Password is required to unlink Google account",
				ErrorCode: "PASSWORD_REQUIRED",
			}))
		}

		match, err := argon2id.ComparePasswordAndHash(req.Password, *user.PasswordHash)
		if err != nil || !match {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid password",
				ErrorCode: "INVALID_PASSWORD",
			}))
		}
	}

	// Eliminar OAuth provider
	if err := tx.Destroy(&oauthProvider); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to unlink Google account",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(UnlinkGoogleResponse{
		Success: true,
		Message: "Google account unlinked successfully",
	}))
}
