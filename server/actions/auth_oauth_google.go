package actions

import (
	"net/http"
	"net/url"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
)

var (
	GoogleClientID     = envy.Get("GOOGLE_CLIENT_ID", "")
	GoogleClientSecret = envy.Get("GOOGLE_CLIENT_SECRET", "")
	GoogleRedirectURI  = envy.Get("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/oauth/google/callback")
)

const (
	GoogleAuthURL  = "https://accounts.google.com/o/oauth2/v2/auth"
	GoogleTokenURL = "https://oauth2.googleapis.com/token"
	GoogleUserURL  = "https://www.googleapis.com/oauth2/v2/userinfo"
)

func AuthOAuthGoogleInitiate(c buffalo.Context) error {
	redirectURI := c.Param("redirect_uri")
	state := c.Param("state")

	if redirectURI == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "redirect_uri is required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	if state == "" {
		state = randomToken(16)
	}

	if GoogleClientID == "" {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Google OAuth is not configured",
			ErrorCode: "OAUTH_NOT_CONFIGURED",
		}))
	}

	stateData := state + "|" + redirectURI
	encodedState := url.QueryEscape(stateData)

	params := url.Values{}
	params.Set("client_id", GoogleClientID)
	params.Set("redirect_uri", GoogleRedirectURI)
	params.Set("response_type", "code")
	params.Set("scope", "openid email profile")
	params.Set("state", encodedState)
	params.Set("access_type", "offline")
	params.Set("prompt", "consent")

	authURL := GoogleAuthURL + "?" + params.Encode()

	return c.Redirect(http.StatusTemporaryRedirect, authURL)
}
