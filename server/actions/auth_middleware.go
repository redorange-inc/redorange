package actions

import (
	"net/http"
	"server/models"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Authorization header is required",
				ErrorCode: "MISSING_AUTH_HEADER",
			}))
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid authorization header format",
				ErrorCode: "INVALID_AUTH_FORMAT",
			}))
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return JWTSecret, nil
		})

		if err != nil || !token.Valid {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid or expired token",
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
		if tokenType != "access" {
			return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Invalid token type",
				ErrorCode: "INVALID_TOKEN_TYPE",
			}))
		}

		userID, _ := claims["user_id"].(string)

		tx, ok := c.Value("tx").(*pop.Connection)
		if !ok || tx == nil {
			return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Database connection not available",
				ErrorCode: "DB_NOT_AVAILABLE",
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

		if !user.Active {
			return c.Render(http.StatusForbidden, r.JSON(ErrorResponse{
				Success:   false,
				Error:     "Account is inactive",
				ErrorCode: "ACCOUNT_INACTIVE",
			}))
		}

		c.Set("current_user", user)
		c.Set("user_id", userID)

		return next(c)
	}
}
