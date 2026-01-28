package actions

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/alexedwards/argon2id"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type RegisterRequest struct {
	Email            string `json:"email"`
	Password         string `json:"password"`
	FirstName        string `json:"first_name"`
	LastNamePaternal string `json:"last_name_paternal"`
	LastNameMaternal string `json:"last_name_maternal"`
	Role             string `json:"role"`
}

type RegisterResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		UserID        string `json:"user_id"`
		Email         string `json:"email"`
		EmailVerified bool   `json:"email_verified"`
	} `json:"data"`
}

type ErrorResponse struct {
	Success   bool           `json:"success"`
	Error     string         `json:"error"`
	ErrorCode string         `json:"error_code,omitempty"`
	Details   map[string]any `json:"details,omitempty"`
}

func AuthRegister(c buffalo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastNamePaternal = strings.TrimSpace(req.LastNamePaternal)
	req.LastNameMaternal = strings.TrimSpace(req.LastNameMaternal)
	req.Role = strings.TrimSpace(req.Role)

	details := map[string]any{}
	if req.Email == "" {
		details["email"] = "Email is required"
	}
	if len(req.Password) < 8 {
		details["password"] = "Password must be at least 8 characters"
	}
	if req.FirstName == "" {
		details["first_name"] = "First name is required"
	}
	if req.LastNamePaternal == "" {
		details["last_name_paternal"] = "Last name (paternal) is required"
	}
	if req.Role == "" || !isAllowedRole(req.Role) {
		details["role"] = "Role must be one of: support, admin, dev"
	}
	if len(details) > 0 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Validation error",
			ErrorCode: "VALIDATION_ERROR",
			Details:   details,
		}))
	}

	pwHash, err := argon2id.CreateHash(req.Password, argon2id.DefaultParams)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create user",
			ErrorCode: "INTERNAL_ERROR",
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

	user := models.User{
		Email:            req.Email,
		EmailVerified:    false,
		PasswordHash:     &pwHash,
		FirstName:        req.FirstName,
		LastNamePaternal: req.LastNamePaternal,
		Role:             req.Role,
		Active:           true,
		TwoFactorEnabled: false,
	}

	if req.LastNameMaternal != "" {
		user.LastNameMaternal = &req.LastNameMaternal
	}

	if err := tx.Create(&user); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(strings.ToLower(err.Error()), "unique") {
			return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Email already registered",
				ErrorCode: "EMAIL_ALREADY_EXISTS",
			}))
		}
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create user",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	rawToken, err := randomToken(32)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create verification token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}
	tokenHash := sha256Hex(rawToken)

	vt := models.VerificationToken{
		UserID:    &user.ID,
		TokenHash: tokenHash,
		TokenType: "email_verification",
		ExpiresAt: time.Now().UTC().Add(2 * time.Hour),
		Used:      false,
	}

	if err := tx.Create(&vt); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create verification token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	response := map[string]any{
		"success": true,
		"message": "User registered successfully. Please verify your email.",
		"data": map[string]any{
			"user_id":        user.ID.String(),
			"email":          user.Email,
			"email_verified": user.EmailVerified,
		},
	}

	if ENV == "development" {
		response["_dev_verification_token"] = rawToken
	}

	return c.Render(http.StatusCreated, r.JSON(response))
}

func isAllowedRole(role string) bool {
	switch role {
	case "support", "admin", "dev":
		return true
	default:
		return false
	}
}

func randomToken(nBytes int) (string, error) {
	b := make([]byte, nBytes)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func sha256Hex(s string) string {
	sum := sha256.Sum256([]byte(s))
	return hex.EncodeToString(sum[:])
}