package actions

import (
	"net/http"
	"server/models"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type MeResponse struct {
	ID               string   `json:"id"`
	Email            string   `json:"email"`
	EmailVerified    bool     `json:"email_verified"`
	Name             string   `json:"name"`
	LastName         string   `json:"last_name"`
	Profile          *string  `json:"profile,omitempty"`
	Role             string   `json:"role"`
	Active           bool     `json:"active"`
	TwoFactorEnabled bool     `json:"two_factor_enabled"`
	OAuthProviders   []string `json:"oauth_providers"`
	HasPassword      bool     `json:"has_password"`
	CreatedAt        string   `json:"created_at"`
	LastLoginAt      *string  `json:"last_login_at,omitempty"`
}

func AuthMe(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Unauthorized",
			ErrorCode: "UNAUTHORIZED",
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

	var oauthProviders []models.OAuthProvider
	tx.Where("user_id = ?", user.ID).All(&oauthProviders)

	providers := make([]string, len(oauthProviders))
	for i, p := range oauthProviders {
		providers[i] = p.Provider
	}

	var lastLoginAt *string
	if user.LastLoginAt != nil {
		formatted := user.LastLoginAt.Format("2006-01-02T15:04:05Z")
		lastLoginAt = &formatted
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"data": MeResponse{
			ID:               user.ID.String(),
			Email:            user.Email,
			EmailVerified:    user.EmailVerified,
			Name:             user.Name,
			LastName:         user.LastName,
			Profile:          user.Profile,
			Role:             user.Role,
			Active:           user.Active,
			TwoFactorEnabled: user.TwoFactorEnabled,
			OAuthProviders:   providers,
			HasPassword:      user.PasswordHash != nil,
			CreatedAt:        user.CreatedAt.Format("2006-01-02T15:04:05Z"),
			LastLoginAt:      lastLoginAt,
		},
	}))
}
