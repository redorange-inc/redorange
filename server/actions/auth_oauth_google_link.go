package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type LinkGoogleRequest struct {
	GoogleAuthCode string `json:"google_auth_code"`
}

func AuthOAuthGoogleLink(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
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

	var existingProvider models.OAuthProvider
	err = tx.Where("user_id = ? AND provider = ?", user.ID, "google").First(&existingProvider)
	if err == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Google account is already linked",
			ErrorCode: "ALREADY_LINKED",
		}))
	}

	googleTokens, err := exchangeGoogleCode(req.GoogleAuthCode)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired Google auth code",
			ErrorCode: "INVALID_AUTH_CODE",
		}))
	}

	googleUser, err := getGoogleUserInfo(googleTokens.AccessToken)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to get Google user info",
			ErrorCode: "GOOGLE_API_ERROR",
		}))
	}

	var otherProvider models.OAuthProvider
	err = tx.Where("provider = ? AND provider_user_id = ?", "google", googleUser.ID).First(&otherProvider)
	if err == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "This Google account is already linked to another user",
			ErrorCode: "GOOGLE_ALREADY_USED",
		}))
	}

	expiresAt := time.Now().UTC().Add(time.Duration(googleTokens.ExpiresIn) * time.Second)
	oauthProvider := models.OAuthProvider{
		UserID:         user.ID,
		Provider:       "google",
		ProviderUserID: googleUser.ID,
		ProviderEmail:  &googleUser.Email,
		AccessToken:    &googleTokens.AccessToken,
		RefreshToken:   &googleTokens.RefreshToken,
		ExpiresAt:      &expiresAt,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}

	if err := tx.Create(&oauthProvider); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to link Google account",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": "Google account linked successfully",
		"data": map[string]interface{}{
			"provider":       "google",
			"provider_email": googleUser.Email,
		},
	}))
}
