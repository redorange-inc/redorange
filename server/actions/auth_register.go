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
	Success   bool                   `json:"success"`
	Error     string                 `json:"error"`
	ErrorCode string                 `json:"error_code,omitempty"`
	Details   map[string]any         `json:"details,omitempty"`
}

func AuthRegister(c buffalo.Context) error {
	// Parse JSON
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	// Basic normalization
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastNamePaternal = strings.TrimSpace(req.LastNamePaternal)
	req.LastNameMaternal = strings.TrimSpace(req.LastNameMaternal)
	req.Role = strings.TrimSpace(req.Role)

	// Validate (simple, puedes endurecerlo luego)
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

	// Hash password
	pwHash, err := argon2id.CreateHash(req.Password, argon2id.DefaultParams)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create user",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}
	
	// DB TX (Buffalo suele poner "tx" en el contexto si está el middleware de transacción)
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok || tx == nil {
		// fallback: sin tx no deberías seguir, pero por seguridad:
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Database connection not available",
			ErrorCode: "DB_NOT_AVAILABLE",
		}))
	}

	// Create user + verification token in one transaction
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

	// Insert user
	if err := tx.Create(&user); err != nil {
		// Email duplicado (unique violation). Pop/pg devuelve error genérico; hacemos heurística simple.
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

	// Create email verification token (store hash; raw token se manda por email)
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
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Used:      false,
	}

	if err := tx.Create(&vt); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create verification token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// TODO: enviar email con rawToken (no se devuelve por API según tu spec)
	_ = rawToken

	// Response 201
	var resp RegisterResponse
	resp.Success = true
	resp.Message = "User registered successfully. Please verify your email."
	resp.Data.UserID = user.ID.String()
	resp.Data.Email = user.Email
	resp.Data.EmailVerified = user.EmailVerified

	return c.Render(http.StatusCreated, r.JSON(resp))
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
