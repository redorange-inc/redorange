// server/actions/auth_register.go

package actions

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	LastName string `json:"last_name"`
	Role     string `json:"role"`
}

type RegisterResponse struct {
	UserID        string `json:"user_id"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
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

	if req.Email == "" || req.Password == "" || req.Name == "" || req.LastName == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Email, password, name and last_name are required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if len(req.Password) < 8 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Password must be at least 8 characters",
			ErrorCode: "PASSWORD_TOO_SHORT",
		}))
	}

	validRoles := map[string]bool{"support": true, "admin": true, "dev": true}
	if req.Role == "" {
		req.Role = "support"
	}
	if !validRoles[req.Role] {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid role. Must be: support, admin, or dev",
			ErrorCode: "INVALID_ROLE",
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

	var existingUser models.User
	err := tx.Where("email = ?", req.Email).First(&existingUser)
	if err == nil {
		return c.Render(http.StatusConflict, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Email already registered",
			ErrorCode: "EMAIL_ALREADY_EXISTS",
		}))
	}

	passwordHash := hashPassword(req.Password)

	user := models.User{
		Email:            req.Email,
		EmailVerified:    false,
		PasswordHash:     &passwordHash,
		Name:             strings.TrimSpace(req.Name),
		LastName:         strings.TrimSpace(req.LastName),
		Role:             req.Role,
		Active:           true,
		TwoFactorEnabled: false,
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
	}

	if err := tx.Create(&user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create user",
			ErrorCode: "CREATE_FAILED",
		}))
	}

	verificationToken := generateSecureToken(32)
	hash := sha256.Sum256([]byte(verificationToken))
	tokenHash := hex.EncodeToString(hash[:])

	verificationTokenModel := models.VerificationToken{
		UserID:    &user.ID,
		TokenHash: tokenHash,
		TokenType: "email_verification",
		ExpiresAt: time.Now().UTC().Add(24 * time.Hour),
		Used:      false,
		CreatedAt: time.Now().UTC(),
	}

	if err := tx.Create(&verificationTokenModel); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create verification token",
			ErrorCode: "TOKEN_CREATE_FAILED",
		}))
	}

	fmt.Printf("[DEV] Verification token for %s: %s\n", user.Email, verificationToken)

	return c.Render(http.StatusCreated, r.JSON(map[string]interface{}{
		"success": true,
		"message": "User registered successfully. Please verify your email.",
		"data": RegisterResponse{
			UserID:        user.ID.String(),
			Email:         user.Email,
			EmailVerified: user.EmailVerified,
		},
		"_dev_verification_token": verificationToken,
	}))
}
