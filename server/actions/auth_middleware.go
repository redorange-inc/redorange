package actions

import (
	"net/http"
	"server/models"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware verifica el JWT en el header Authorization
func AuthMiddleware(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Authorization header required",
				ErrorCode: "MISSING_AUTH_HEADER",
			}))
		}

		// Verificar formato "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid authorization header format",
				ErrorCode: "INVALID_AUTH_FORMAT",
			}))
		}

		tokenString := parts[1]

		// Parsear y validar JWT
		claims := &JWTClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return JWTSecret, nil
		})

		if err != nil || !token.Valid {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid or expired token",
				ErrorCode: "INVALID_TOKEN",
			}))
		}

		// Verificar que sea un access token
		if claims.TokenType != "access" {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid token type",
				ErrorCode: "INVALID_TOKEN_TYPE",
			}))
		}

		// Obtener usuario de la BD
		tx, ok := c.Value("tx").(*pop.Connection)
		if !ok || tx == nil {
			return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Database connection not available",
				ErrorCode: "DB_NOT_AVAILABLE",
			}))
		}

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

		// Verificar que el usuario esté activo
		if !user.Active {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Account is deactivated",
				ErrorCode: "ACCOUNT_INACTIVE",
			}))
		}

		// Guardar usuario y claims en el contexto
		c.Set("currentUser", user)
		c.Set("claims", claims)

		return next(c)
	}
}

// GetCurrentUser obtiene el usuario del contexto (helper)
func GetCurrentUser(c buffalo.Context) *models.User {
	if user, ok := c.Value("currentUser").(models.User); ok {
		return &user
	}
	return nil
}

// GetClaims obtiene los claims del contexto (helper)
func GetClaims(c buffalo.Context) *JWTClaims {
	if claims, ok := c.Value("claims").(*JWTClaims); ok {
		return claims
	}
	return nil
}