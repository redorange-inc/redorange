package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Link Google Account

type LinkGoogleRequest struct {
	GoogleAuthCode string `json:"google_auth_code"`
}

type LinkGoogleResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		Provider      string `json:"provider"`
		ProviderEmail string `json:"provider_email"`
	} `json:"data"`
}

func AuthOAuthGoogleLink(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	var req LinkGoogleRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.GoogleAuthCode = strings.TrimSpace(req.GoogleAuthCode)

	if req.GoogleAuthCode == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Google auth code is required",
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

	// Verificar si ya tiene Google vinculado
	var existingProvider models.OAuthProvider
	err := tx.Where("user_id = ? AND provider = ?", user.ID, "google").First(&existingProvider)
	if err == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Google account is already linked",
			ErrorCode: "ALREADY_LINKED",
		}))
	}

	// Intercambiar code por tokens
	googleTokens, err := exchangeGoogleCode(req.GoogleAuthCode)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired Google auth code",
			ErrorCode: "INVALID_AUTH_CODE",
		}))
	}

	// Obtener info del usuario de Google
	googleUser, err := getGoogleUserInfo(googleTokens.AccessToken)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to get Google user info",
			ErrorCode: "GOOGLE_API_ERROR",
		}))
	}

	// Verificar que este Google ID no esté vinculado a otra cuenta
	var otherProvider models.OAuthProvider
	err = tx.Where("provider = ? AND provider_user_id = ?", "google", googleUser.ID).First(&otherProvider)
	if err == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "This Google account is already linked to another user",
			ErrorCode: "GOOGLE_ALREADY_USED",
		}))
	}

	// Crear OAuth provider link
	expiresAt := time.Now().UTC().Add(time.Duration(googleTokens.ExpiresIn) * time.Second)
	oauthProvider := models.OAuthProvider{
		UserID:         user.ID,
		Provider:       "google",
		ProviderUserID: googleUser.ID,
		AccessToken:    &googleTokens.AccessToken,
		RefreshToken:   &googleTokens.RefreshToken,
		ExpiresAt:      &expiresAt,
	}

	if err := tx.Create(&oauthProvider); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to link Google account",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Respuesta
	var resp LinkGoogleResponse
	resp.Success = true
	resp.Message = "Google account linked successfully"
	resp.Data.Provider = "google"
	resp.Data.ProviderEmail = googleUser.Email

	return c.Render(http.StatusOK, r.JSON(resp))
}
