package actions

import (
	"net/http"
	"server/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Get Current User

type CurrentUserResponse struct {
	Success bool `json:"success"`
	Data    struct {
		ID               string     `json:"id"`
		Email            string     `json:"email"`
		EmailVerified    bool       `json:"email_verified"`
		FirstName        string     `json:"first_name"`
		LastNamePaternal string     `json:"last_name_paternal"`
		LastNameMaternal *string    `json:"last_name_maternal,omitempty"`
		Role             string     `json:"role"`
		Active           bool       `json:"active"`
		TwoFactorEnabled bool       `json:"two_factor_enabled"`
		OAuthProviders   []string   `json:"oauth_providers"`
		HasPassword      bool       `json:"has_password"`
		CreatedAt        time.Time  `json:"created_at"`
		LastLoginAt      *time.Time `json:"last_login_at,omitempty"`
	} `json:"data"`
}

func AuthMe(c buffalo.Context) error {
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

	// Obtener OAuth providers vinculados
	var oauthProviders []models.OAuthProvider
	tx.Where("user_id = ?", user.ID).All(&oauthProviders)

	providerNames := make([]string, len(oauthProviders))
	for i, provider := range oauthProviders {
		providerNames[i] = provider.Provider
	}

	// Construir respuesta
	var resp CurrentUserResponse
	resp.Success = true
	resp.Data.ID = user.ID.String()
	resp.Data.Email = user.Email
	resp.Data.EmailVerified = user.EmailVerified
	resp.Data.FirstName = user.FirstName
	resp.Data.LastNamePaternal = user.LastNamePaternal
	resp.Data.LastNameMaternal = user.LastNameMaternal
	resp.Data.Role = user.Role
	resp.Data.Active = user.Active
	resp.Data.TwoFactorEnabled = user.TwoFactorEnabled
	resp.Data.OAuthProviders = providerNames
	resp.Data.HasPassword = user.PasswordHash != nil && *user.PasswordHash != ""
	resp.Data.CreatedAt = user.CreatedAt
	resp.Data.LastLoginAt = user.LastLoginAt

	return c.Render(http.StatusOK, r.JSON(resp))
}
