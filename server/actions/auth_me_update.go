// server/actions/auth_me_update.go

package actions

import (
	"net/http"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

type UpdateProfileRequest struct {
	Name     string  `json:"name"`
	LastName string  `json:"last_name"`
	Profile  *string `json:"profile"`
}

func AuthMeUpdate(c buffalo.Context) error {
	user, err := GetCurrentUser(c)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Unauthorized",
			ErrorCode: "UNAUTHORIZED",
		}))
	}

	var req UpdateProfileRequest
	if err := c.Bind(&req); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorCode: "INVALID_BODY",
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

	if req.Name != "" {
		user.Name = strings.TrimSpace(req.Name)
	}
	if req.LastName != "" {
		user.LastName = strings.TrimSpace(req.LastName)
	}
	if req.Profile != nil {
		user.Profile = req.Profile
	}

	user.UpdatedAt = time.Now().UTC()

	if err := tx.Update(&user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to update profile",
			ErrorCode: "UPDATE_FAILED",
		}))
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"success": true,
		"message": "Profile updated successfully",
		"data": map[string]interface{}{
			"id":        user.ID.String(),
			"email":     user.Email,
			"name":      user.Name,
			"last_name": user.LastName,
			"profile":   user.Profile,
		},
	}))
}
