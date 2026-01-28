package actions

import (
	"encoding/json"
	"net"
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/alexedwards/argon2id"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
)

// JWT config - en producción, usar variables de entorno
var (
	JWTSecret             = []byte("your-secret-key-change-in-production") // TODO: usar envy.Get("JWT_SECRET", "")
	AccessTokenDuration   = 15 * time.Minute
	RefreshTokenDuration  = 7 * 24 * time.Hour
	TempTokenDuration     = 5 * time.Minute
	MaxFailedAttempts     = 5
	LockDuration          = 15 * time.Minute
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success bool `json:"success"`
	Data    struct {
		AccessToken  string    `json:"access_token"`
		RefreshToken string    `json:"refresh_token"`
		TokenType    string    `json:"token_type"`
		ExpiresIn    int       `json:"expires_in"`
		User         LoginUser `json:"user"`
	} `json:"data"`
}

type LoginUser struct {
	ID               string `json:"id"`
	Email            string `json:"email"`
	FirstName        string `json:"first_name"`
	LastNamePaternal string `json:"last_name_paternal"`
	Role             string `json:"role"`
	TwoFactorEnabled bool   `json:"two_factor_enabled"`
}

type Login2FAResponse struct {
	Success     bool `json:"success"`
	Requires2FA bool `json:"requires_2fa"`
	Data        struct {
		TempToken string `json:"temp_token"`
		Message   string `json:"message"`
	} `json:"data"`
}

type LockedResponse struct {
	Success     bool      `json:"success"`
	Error       string    `json:"error"`
	ErrorCode   string    `json:"error_code"`
	LockedUntil time.Time `json:"locked_until"`
}

type JWTClaims struct {
	UserID    string `json:"user_id"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	TokenType string `json:"token_type"` // "access", "refresh", "temp_2fa"
	jwt.RegisteredClaims
}

func AuthLogin(c buffalo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
		}))
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Email == "" || req.Password == "" {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Email and password are required",
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

	// Buscar usuario
	var user models.User
	err := tx.Where("email = ?", req.Email).First(&user)
	if err != nil {
		// Usuario no existe - registrar intento fallido (sin user_id)
		logLoginAttempt(tx, req.Email, nil, false, "user_not_found", c)
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid email or password",
			ErrorCode: "INVALID_CREDENTIALS",
		}))
	}

	// Verificar si la cuenta está bloqueada
	var lock models.AccountLock
	err = tx.Where("user_id = ?", user.ID).First(&lock)
	if err == nil && time.Now().UTC().Before(lock.LockedUntil) {
		return c.Render(http.StatusLocked, r.JSON(LockedResponse{
			Success:     false,
			Error:       "Account temporarily locked due to multiple failed attempts",
			ErrorCode:   "ACCOUNT_LOCKED",
			LockedUntil: lock.LockedUntil,
		}))
	}

	// Si había un lock expirado, eliminarlo
	if err == nil && time.Now().UTC().After(lock.LockedUntil) {
		tx.Destroy(&lock)
	}

	// Verificar que tenga password (no sea usuario solo OAuth)
	if user.PasswordHash == nil || *user.PasswordHash == "" {
		logLoginAttempt(tx, req.Email, &user.ID, false, "no_password_set", c)
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid email or password",
			ErrorCode: "INVALID_CREDENTIALS",
		}))
	}

	// Verificar password
	match, err := argon2id.ComparePasswordAndHash(req.Password, *user.PasswordHash)
	if err != nil || !match {
		logLoginAttempt(tx, req.Email, &user.ID, false, "invalid_password", c)
		
		// Verificar si debemos bloquear la cuenta
		if shouldLockAccount(tx, user.ID) {
			lockAccount(tx, user.ID)
			return c.Render(http.StatusLocked, r.JSON(LockedResponse{
				Success:     false,
				Error:       "Account temporarily locked due to multiple failed attempts",
				ErrorCode:   "ACCOUNT_LOCKED",
				LockedUntil: time.Now().UTC().Add(LockDuration),
			}))
		}

		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid email or password",
			ErrorCode: "INVALID_CREDENTIALS",
		}))
	}

	// Verificar que el email esté verificado
	if !user.EmailVerified {
		logLoginAttempt(tx, req.Email, &user.ID, false, "email_not_verified", c)
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Please verify your email before logging in",
			ErrorCode: "EMAIL_NOT_VERIFIED",
		}))
	}

	// Verificar que la cuenta esté activa
	if !user.Active {
		logLoginAttempt(tx, req.Email, &user.ID, false, "account_inactive", c)
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Account is deactivated",
			ErrorCode: "ACCOUNT_INACTIVE",
		}))
	}

	// Si tiene 2FA habilitado, devolver token temporal
	if user.TwoFactorEnabled {
		tempToken, err := generateToken(user, "temp_2fa", TempTokenDuration)
		if err != nil {
			return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Failed to generate token",
				ErrorCode: "INTERNAL_ERROR",
			}))
		}

		logLoginAttempt(tx, req.Email, &user.ID, true, "pending_2fa", c)

		var resp Login2FAResponse
		resp.Success = true
		resp.Requires2FA = true
		resp.Data.TempToken = tempToken
		resp.Data.Message = "Please provide 2FA code"

		return c.Render(http.StatusOK, r.JSON(resp))
	}

	// Login exitoso sin 2FA - generar tokens
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

	// Guardar sesión con refresh token
	if err := createSession(tx, user.ID, refreshToken, c); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to create session",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Actualizar last_login_at
	now := time.Now().UTC()
	user.LastLoginAt = &now
	tx.Update(&user)

	// Registrar login exitoso
	logLoginAttempt(tx, req.Email, &user.ID, true, "", c)

	// Respuesta exitosa
	var resp LoginResponse
	resp.Success = true
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

	return c.Render(http.StatusOK, r.JSON(resp))
}

func generateToken(user models.User, tokenType string, duration time.Duration) (string, error) {
	now := time.Now().UTC()
	claims := JWTClaims{
		UserID:    user.ID.String(),
		Email:     user.Email,
		Role:      user.Role,
		TokenType: tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(duration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "server",
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWTSecret)
}

func createSession(tx *pop.Connection, userID uuid.UUID, refreshToken string, c buffalo.Context) error {
	refreshTokenHash := sha256Hex(refreshToken)

	// Device info del request
	deviceInfo := map[string]string{
		"user_agent": c.Request().UserAgent(),
		"ip_address": c.Request().RemoteAddr,
	}

	deviceInfoJSON, _ := json.Marshal(deviceInfo)

	session := models.Session{
		UserID:           userID,
		RefreshTokenHash: refreshTokenHash,
		DeviceInfo:       deviceInfoJSON,
		ExpiresAt:        time.Now().UTC().Add(RefreshTokenDuration),
		Revoked:          false,
	}

	return tx.Create(&session)
}

func logLoginAttempt(tx *pop.Connection, email string, userID *uuid.UUID, success bool, failureReason string, c buffalo.Context) {
	// Extraer IP sin puerto
	ipAddress := extractIP(c.Request().RemoteAddr)
	
	attempt := models.LoginAttempt{
		Email:         &email,
		UserID:        userID,
		Success:       success,
		FailureReason: nilIfEmpty(failureReason),
		IPAddress:     nilIfEmpty(ipAddress),
		UserAgent:     nilIfEmpty(c.Request().UserAgent()),
	}

	tx.Create(&attempt)
}

// extractIP extrae la IP sin el puerto
func extractIP(remoteAddr string) string {
	// RemoteAddr puede ser "192.168.1.1:54321" o "[::1]:54321" (IPv6)
	if remoteAddr == "" {
		return ""
	}
	
	// Intentar separar host:port
	host, _, err := net.SplitHostPort(remoteAddr)
	if err != nil {
		// Si falla, puede que no tenga puerto, devolver tal cual
		return remoteAddr
	}
	return host
}

func shouldLockAccount(tx *pop.Connection, userID uuid.UUID) bool {
	// Contar intentos fallidos en los últimos 15 minutos
	var count int
	since := time.Now().UTC().Add(-LockDuration)
	
	tx.RawQuery(`
		SELECT COUNT(*) FROM auth.login_attempts 
		WHERE user_id = ? AND success = false AND created_at > ?
	`, userID, since).First(&count)

	return count >= MaxFailedAttempts
}

func lockAccount(tx *pop.Connection, userID uuid.UUID) {
	lockedUntil := time.Now().UTC().Add(LockDuration)
	reason := "Multiple failed login attempts"

	tx.RawQuery(`
		INSERT INTO auth.account_locks (id, user_id, locked_until, reason, created_at)
		VALUES (gen_random_uuid(), ?, ?, ?, NOW())
		ON CONFLICT (user_id) DO UPDATE SET locked_until = ?, reason = ?
	`, userID, lockedUntil, reason, lockedUntil, reason).Exec()
}

func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}