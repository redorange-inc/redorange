package actions

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Google OAuth Callback

type GoogleTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
	IDToken      string `json:"id_token"`
}

type GoogleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
}

func AuthOAuthGoogleCallback(c buffalo.Context) error {
	code := c.Param("code")
	state := c.Param("state")
	errorParam := c.Param("error")

	// Decodificar state para obtener redirect_uri original
	decodedState, _ := url.QueryUnescape(state)
	stateParts := strings.Split(decodedState, "|")

	frontendRedirect := "http://localhost:3001/auth/callback" // Default
	if len(stateParts) >= 2 {
		frontendRedirect = stateParts[1]
	}

	// Si Google devolvió error
	if errorParam != "" {
		redirectURL := frontendRedirect + "?error=" + url.QueryEscape(errorParam)
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	if code == "" {
		redirectURL := frontendRedirect + "?error=missing_code"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Intercambiar code por tokens de Google
	googleTokens, err := exchangeGoogleCode(code)
	if err != nil {
		redirectURL := frontendRedirect + "?error=token_exchange_failed"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Obtener info del usuario de Google
	googleUser, err := getGoogleUserInfo(googleTokens.AccessToken)
	if err != nil {
		redirectURL := frontendRedirect + "?error=user_info_failed"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		redirectURL := frontendRedirect + "?error=server_error"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Buscar si ya existe OAuth provider con este Google ID
	var oauthProvider models.OAuthProvider
	err = tx.Where("provider = ? AND provider_user_id = ?", "google", googleUser.ID).First(&oauthProvider)

	var user models.User

	if err == nil {
		// Usuario ya existe con este Google - login
		if err := tx.Find(&user, oauthProvider.UserID); err != nil {
			redirectURL := frontendRedirect + "?error=user_not_found"
			return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		}
	} else {
		// Buscar si existe usuario con este email
		err = tx.Where("email = ?", strings.ToLower(googleUser.Email)).First(&user)

		if err != nil {
			// Crear nuevo usuario
			user = models.User{
				Email:            strings.ToLower(googleUser.Email),
				EmailVerified:    googleUser.VerifiedEmail,
				FirstName:        googleUser.GivenName,
				LastNamePaternal: googleUser.FamilyName,
				Role:             "support", // Role por defecto
				Active:           true,
				TwoFactorEnabled: false,
			}

			if user.FirstName == "" {
				user.FirstName = googleUser.Name
			}
			if user.LastNamePaternal == "" {
				user.LastNamePaternal = "User"
			}

			if err := tx.Create(&user); err != nil {
				redirectURL := frontendRedirect + "?error=user_creation_failed"
				return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
			}
		}

		// Crear OAuth provider link
		expiresAt := time.Now().UTC().Add(time.Duration(googleTokens.ExpiresIn) * time.Second)
		newOAuthProvider := models.OAuthProvider{
			UserID:         user.ID,
			Provider:       "google",
			ProviderUserID: googleUser.ID,
			AccessToken:    &googleTokens.AccessToken,
			RefreshToken:   &googleTokens.RefreshToken,
			ExpiresAt:      &expiresAt,
		}

		if err := tx.Create(&newOAuthProvider); err != nil {
			redirectURL := frontendRedirect + "?error=oauth_link_failed"
			return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		}
	}

	// Verificar si la cuenta está activa
	if !user.Active {
		redirectURL := frontendRedirect + "?error=account_inactive"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Si tiene 2FA habilitado, devolver temp_token
	if user.TwoFactorEnabled {
		tempToken, err := generateToken(user, "temp_2fa", TempTokenDuration)
		if err != nil {
			redirectURL := frontendRedirect + "?error=token_generation_failed"
			return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		}

		redirectURL := frontendRedirect + "?requires_2fa=true&temp_token=" + url.QueryEscape(tempToken)
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Generar tokens JWT
	accessToken, err := generateToken(user, "access", AccessTokenDuration)
	if err != nil {
		redirectURL := frontendRedirect + "?error=token_generation_failed"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	refreshToken, err := generateToken(user, "refresh", RefreshTokenDuration)
	if err != nil {
		redirectURL := frontendRedirect + "?error=token_generation_failed"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Crear sesión
	if err := createSession(tx, user.ID, refreshToken, c); err != nil {
		redirectURL := frontendRedirect + "?error=session_creation_failed"
		return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
	}

	// Actualizar last_login_at
	now := time.Now().UTC()
	user.LastLoginAt = &now
	tx.Update(&user)

	// Registrar login
	logLoginAttempt(tx, user.Email, &user.ID, true, "oauth_google", c)

	// Redirect con tokens
	redirectURL := frontendRedirect + "?access_token=" + url.QueryEscape(accessToken) + "&refresh_token=" + url.QueryEscape(refreshToken)
	return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

func exchangeGoogleCode(code string) (*GoogleTokenResponse, error) {
	data := url.Values{}
	data.Set("code", code)
	data.Set("client_id", GoogleClientID)
	data.Set("client_secret", GoogleClientSecret)
	data.Set("redirect_uri", GoogleRedirectURI)
	data.Set("grant_type", "authorization_code")

	resp, err := http.PostForm(GoogleTokenURL, data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var tokens GoogleTokenResponse
	if err := json.Unmarshal(body, &tokens); err != nil {
		return nil, err
	}

	return &tokens, nil
}

func getGoogleUserInfo(accessToken string) (*GoogleUserInfo, error) {
	req, err := http.NewRequest("GET", GoogleUserURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var userInfo GoogleUserInfo
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
