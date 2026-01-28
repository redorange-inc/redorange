package actions

import (
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
)

// -- Verify Backup Code (During Login)

type VerifyBackupCodeRequest struct {
	TempToken  string `json:"temp_token"`
	BackupCode string `json:"backup_code"`
}

type VerifyBackupCodeResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		AccessToken  string    `json:"access_token"`
		RefreshToken string    `json:"refresh_token"`
		TokenType    string    `json:"token_type"`
		ExpiresIn    int       `json:"expires_in"`
		User         LoginUser `json:"user"`
		Warning      string    `json:"warning"`
	} `json:"data"`
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

	// Validar el JWT del temp token
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(req.TempToken, claims, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or expired temp token",
			ErrorCode: "INVALID_TOKEN",
		}))
	}

	// Verificar que sea un temp_2fa token
	if claims.TokenType != "temp_2fa" {
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

	// Obtener usuario
	userID, err := uuid.FromString(claims.UserID)
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

	// Verificar que tenga 2FA habilitado
	if !user.TwoFactorEnabled {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "2FA is not enabled for this user",
			ErrorCode: "2FA_NOT_ENABLED",
		}))
	}

	// Hashear el backup code (sin guiones)
	codeWithoutDashes := strings.ReplaceAll(req.BackupCode, "-", "")
	codeHash := sha256Hex(codeWithoutDashes)

	// Buscar backup code válido
	var backupCode models.TwoFactorBackupCode
	err = tx.Where("user_id = ? AND code_hash = ? AND used = ?", user.ID, codeHash, false).First(&backupCode)
	if err != nil {
		// Registrar intento fallido
		logLoginAttempt(tx, user.Email, &user.ID, false, "backup_code_invalid", c)

		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid or already used backup code",
			ErrorCode: "INVALID_BACKUP_CODE",
		}))
	}

	// Marcar backup code como usado
	backupCode.Used = true
	now := time.Now().UTC()
	backupCode.UsedAt = &now
	if err := tx.Update(&backupCode); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to process backup code",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Generar tokens
	accessToken, err := generateToken(user, "access", AccessTokenDuration)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate access token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	refreshToken, err := generateToken(user, "refresh", RefreshTokenDuration)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to generate refresh token",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Guardar sesión
	if err := createSession(tx, user.ID, refreshToken, c); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create session",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Actualizar last_login_at
	user.LastLoginAt = &now
	tx.Update(&user)

	// Registrar login exitoso
	logLoginAttempt(tx, user.Email, &user.ID, true, "backup_code_used", c)

	// Contar backup codes restantes
	var remainingCodes int
	tx.RawQuery(`
		SELECT COUNT(*) FROM auth.two_factor_backup_codes 
		WHERE user_id = ? AND used = false
	`, user.ID).First(&remainingCodes)

	// Respuesta
	var resp VerifyBackupCodeResponse
	resp.Success = true
	resp.Message = "Backup code accepted"
	resp.Data.AccessToken = accessToken
	resp.Data.RefreshToken = refreshToken
	resp.Data.TokenType = "Bearer"
	resp.Data.ExpiresIn = int(AccessTokenDuration.Seconds())
	resp.Data.User = LoginUser{
		ID:               user.ID.String(),
		Email:            user.Email,
		FirstName:        user.FirstName,
		LastNamePaternal: user.LastNamePaternal,
		Role:             user.Role,
		TwoFactorEnabled: user.TwoFactorEnabled,
	}
	resp.Data.Warning = "This backup code has been used and cannot be reused"

	// Agregar advertencia si quedan pocos códigos
	if remainingCodes <= 3 {
		resp.Data.Warning = resp.Data.Warning + ". Warning: You only have " + string(rune('0'+remainingCodes)) + " backup codes remaining. Please regenerate them soon."
	}

	return c.Render(http.StatusOK, r.JSON(resp))
}
