package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type RequestPasswordResetRequest struct {
	Email string `json:"email"`
}

func AuthRequestPasswordReset(c buffalo.Context) error {
	var req RequestPasswordResetRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	successResponse := map[string]interface{}{
		"success": true,
		"message": "If the email exists, a password reset link has been sent",
	}

	if req.Email == "" {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	var user models.User
	err := tx.Where("email = ?", req.Email).First(&user)
	if err != nil {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	if user.PasswordHash == nil || *user.PasswordHash == "" {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	tx.RawQuery(`
		UPDATE auth.verification_tokens 
		SET used = true, used_at = NOW() 
		WHERE user_id = ? AND token_type = ? AND used = false
	`, user.ID, "password_reset").Exec()

	rawToken := randomToken(32)
	tokenHash := sha256Hex(rawToken)

	vt := models.VerificationToken{
		UserID:    &user.ID,
		TokenHash: tokenHash,
		TokenType: "password_reset",
		ExpiresAt: time.Now().UTC().Add(1 * time.Hour),
		Used:      false,
		CreatedAt: time.Now().UTC(),
	}

	if err := tx.Create(&vt); err != nil {
		return c.Render(http.StatusOK, r.JSON(successResponse))
	}

	if ENV == "development" {
		return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
			"success":                   true,
			"message":                   "If the email exists, a password reset link has been sent",
			"_dev_password_reset_token": rawToken,
		}))
	}

	return c.Render(http.StatusOK, r.JSON(successResponse))
}
