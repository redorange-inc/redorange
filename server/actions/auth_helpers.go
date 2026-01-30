package actions

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"server/models"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/argon2"
)

// -- token generation

func generateSecureToken(length int) string {
	bytes := make([]byte, length)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func randomToken(length int) string {
	return generateSecureToken(length)
}

func sha256Hex(data string) string {
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// -- password hashing

func hashPassword(password string) string {
	salt := make([]byte, 16)
	rand.Read(salt)
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return fmt.Sprintf("$argon2id$v=19$m=65536,t=1,p=4$%s$%s",
		hex.EncodeToString(salt),
		hex.EncodeToString(hash))
}

func verifyPassword(password, encodedHash string) bool {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false
	}
	salt, _ := hex.DecodeString(parts[4])
	expectedHash, _ := hex.DecodeString(parts[5])
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	if len(hash) != len(expectedHash) {
		return false
	}
	for i := range hash {
		if hash[i] != expectedHash[i] {
			return false
		}
	}
	return true
}

// -- jwt token generation

func generateToken(user models.User, tokenType string, duration time.Duration) (string, error) {
	now := time.Now().UTC()
	claims := jwt.MapClaims{
		"user_id":    user.ID.String(),
		"email":      user.Email,
		"role":       user.Role,
		"token_type": tokenType,
		"iss":        "server",
		"sub":        user.ID.String(),
		"exp":        now.Add(duration).Unix(),
		"nbf":        now.Unix(),
		"iat":        now.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWTSecret)
}

// -- device info extraction

func extractDeviceInfo(r *http.Request) map[string]string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.Header.Get("X-Real-IP")
	}
	if ip == "" {
		ip, _, _ = net.SplitHostPort(r.RemoteAddr)
	}
	return map[string]string{
		"ip_address": ip,
		"user_agent": r.UserAgent(),
	}
}

// -- login attempt recording

func recordLoginAttempt(tx *pop.Connection, userID *uuid.UUID, email string, success bool, failureReason string, r *http.Request) {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.Header.Get("X-Real-IP")
	}
	if ip == "" {
		host, _, err := net.SplitHostPort(r.RemoteAddr)
		if err == nil {
			ip = host
		}
	}

	var ipAddr *string
	if ip != "" {
		ipAddr = &ip
	}

	userAgent := r.UserAgent()
	var userAgentPtr *string
	if userAgent != "" {
		userAgentPtr = &userAgent
	}

	var failureReasonPtr *string
	if failureReason != "" {
		failureReasonPtr = &failureReason
	}

	attempt := models.LoginAttempt{
		UserID:        userID,
		Email:         &email,
		Success:       success,
		FailureReason: failureReasonPtr,
		IPAddress:     ipAddr,
		UserAgent:     userAgentPtr,
		CreatedAt:     time.Now().UTC(),
	}
	tx.Create(&attempt)
}

func logLoginAttempt(tx *pop.Connection, userID *uuid.UUID, email string, success bool, failureReason string, r *http.Request) {
	recordLoginAttempt(tx, userID, email, success, failureReason, r)
}

// -- account lock management

func checkAndLockAccount(tx *pop.Connection, userID uuid.UUID) {
	var count int
	tx.RawQuery(`
		SELECT COUNT(*) FROM auth.login_attempts 
		WHERE user_id = ? AND success = false AND created_at > ?
	`, userID, time.Now().UTC().Add(-15*time.Minute)).First(&count)

	if count >= MaxLoginAttempts {
		tx.RawQuery("DELETE FROM auth.account_locks WHERE user_id = ?", userID).Exec()
		lock := models.AccountLock{
			UserID:      userID,
			Reason:      stringPtr("Multiple failed login attempts"),
			LockedUntil: time.Now().UTC().Add(LockDuration),
			CreatedAt:   time.Now().UTC(),
		}
		tx.Create(&lock)
	}
}

func clearAccountLock(tx *pop.Connection, userID uuid.UUID) {
	tx.RawQuery("DELETE FROM auth.account_locks WHERE user_id = ?", userID).Exec()
}

// -- session creation

func createSession(tx *pop.Connection, user models.User, r *http.Request) (string, string, error) {
	accessToken, err := generateToken(user, "access", AccessTokenDuration)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := generateToken(user, "refresh", RefreshTokenDuration)
	if err != nil {
		return "", "", err
	}

	refreshTokenHash := sha256Hex(refreshToken)
	deviceInfo := extractDeviceInfo(r)
	deviceInfoJSON, _ := json.Marshal(deviceInfo)

	session := models.Session{
		UserID:           user.ID,
		RefreshTokenHash: refreshTokenHash,
		DeviceInfo:       deviceInfoJSON,
		ExpiresAt:        time.Now().UTC().Add(RefreshTokenDuration),
		LastActivityAt:   time.Now().UTC(),
		Revoked:          false,
		CreatedAt:        time.Now().UTC(),
	}

	if err := tx.Create(&session); err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// -- get current user from context

func GetCurrentUser(c buffalo.Context) (models.User, error) {
	user, ok := c.Value("current_user").(models.User)
	if !ok {
		return models.User{}, fmt.Errorf("user not found in context")
	}
	return user, nil
}

// -- utility functions

func stringPtr(s string) *string {
	return &s
}
