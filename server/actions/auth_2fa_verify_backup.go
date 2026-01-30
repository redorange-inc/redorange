package actions

import (
	"fmt"
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
)

type VerifyBackupCodeRequest struct {
	TempToken  string `json:"temp_token"`
	BackupCode string `json:"backup_code"`
}

func Auth2FAVerifyBackup(c buffalo.Context) error {
	var req VerifyBackupCodeRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.TempToken = strings.TrimSpace(req.TempToken)
	req.BackupCode = strings.ToUpper(strings.TrimSpace(req.BackupCode))

	if req.TempToken == "" || req.BackupCode == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Temp token and backup code are required",
			ErrorCode: "VALIDATION_ERROR",
		}))
	}

	token, err := jwt.Parse(req.TempToken, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired temp token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token claims",
			ErrorCode: "INVALID_CLAIMS",
		}))
	}

	tokenType, _ := claims["token_type"].(string)
	if tokenType != "temp_2fa" {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token type",
			ErrorCode: "INVALID_TOKEN_TYPE",
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

	userIDStr, _ := claims["user_id"].(string)
	userID, err := uuid.FromString(userIDStr)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	var user models.User
	if err := tx.Find(&user, userID); err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
		}))
	}

	if !user.TwoFactorEnabled {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "2FA is not enabled for this user",
			ErrorCode: "2FA_NOT_ENABLED",
		}))
	}

	codeWithoutDashes := strings.ReplaceAll(req.BackupCode, "-", "")
	codeHash := sha256Hex(codeWithoutDashes)

	var backupCode models.TwoFactorBackupCode
	err = tx.Where("user_id = ? AND code_hash = ? AND used = ?", user.ID, codeHash, false).First(&backupCode)
	if err != nil {
		recordLoginAttempt(tx, &user.ID, user.Email, false, "backup_code_invalid", c.Request())
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or already used backup code",
			ErrorCode: "INVALID_BACKUP_CODE",
		}))
	}

	now := time.Now().UTC()
	backupCode.Used = true
	backupCode.UsedAt = &now
	if err := tx.Update(&backupCode); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to process backup code",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	accessToken, refreshToken, err := createSession(tx, user, c.Request())
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create session",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	user.LastLoginAt = &now
	tx.Update(&user)

	recordLoginAttempt(tx, &user.ID, user.Email, true, "", c.Request())

	var remainingCodes int
	tx.RawQuery("SELECT COUNT(*) FROM auth.two_factor_backup_codes WHERE user_id = ? AND used = false", user.ID).First(&remainingCodes)

	warning := "This backup code has been used and cannot be reused"
	if remainingCodes <= 3 {
		warning = fmt.Sprintf("%s. Warning: You only have %d backup codes remaining. Please regenerate them soon.", warning, remainingCodes)
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": "Backup code accepted",
		"data": map[string]interface{}{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"token_type":    "Bearer",
			"expires_in":    int(AccessTokenDuration.Seconds()),
			"user": LoginUser{
				ID:               user.ID.String(),
				Email:            user.Email,
				Name:             user.Name,
				LastName:         user.LastName,
				Profile:          user.Profile,
				Role:             user.Role,
				TwoFactorEnabled: user.TwoFactorEnabled,
			},
			"warning": warning,
		},
	}))
}
