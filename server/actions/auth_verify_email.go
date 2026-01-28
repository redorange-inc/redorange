package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type VerifyEmailRequest struct {
	Token string `json:"token"`
}

type VerifyEmailResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func AuthVerifyEmail(c buffalo.Context) error {
	var req VerifyEmailRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Token = strings.TrimSpace(req.Token)

	if req.Token == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Token is required",
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

	// Hash the token to compare with stored hash
	tokenHash := sha256Hex(req.Token)

	// Find verification token
	var vt models.VerificationToken
	err := tx.Where("token_hash = ? AND token_type = ? AND used = ?", tokenHash, "email_verification", false).First(&vt)
	if err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Check if token is expired
	if time.Now().After(vt.ExpiresAt) {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Token has expired",
			ErrorCode: "TOKEN_EXPIRED",
		}))
	}

	// Check if user exists
	if vt.UserID == nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Get user
	var user models.User
	if err := tx.Find(&user, *vt.UserID); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	// Check if already verified
	if user.EmailVerified {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Email already verified",
			ErrorCode: "ALREADY_VERIFIED",
		}))
	}

	// Update user email_verified
	user.EmailVerified = true
	if err := tx.Update(&user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to verify email",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Mark token as used
	vt.Used = true
	now := time.Now()
	vt.UsedAt = &now
	if err := tx.Update(&vt); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to update token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(VerifyEmailResponse{
		Success: true,
		Message: "Email verified successfully",
	}))
}