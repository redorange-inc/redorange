package actions

import (
	"net/http"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
)

// -- Update Profile

type UpdateProfileRequest struct {
	FirstName        string `json:"first_name"`
	LastNamePaternal string `json:"last_name_paternal"`
	LastNameMaternal string `json:"last_name_maternal"`
}

type UpdateProfileResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		ID               string  `json:"id"`
		Email            string  `json:"email"`
		FirstName        string  `json:"first_name"`
		LastNamePaternal string  `json:"last_name_paternal"`
		LastNameMaternal *string `json:"last_name_maternal,omitempty"`
	} `json:"data"`
}

func AuthMeUpdate(c buffalo.Context) error {
	user := GetCurrentUser(c)
	if user == nil {
		return c.Render(http.StatusUnauthorized, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "User not found",
			ErrorCode: "USER_NOT_FOUND",
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

	// Normalizar
	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastNamePaternal = strings.TrimSpace(req.LastNamePaternal)
	req.LastNameMaternal = strings.TrimSpace(req.LastNameMaternal)

	// Validar
	details := map[string]any{}
	if req.FirstName == "" {
		details["first_name"] = "First name is required"
	}
	if req.LastNamePaternal == "" {
		details["last_name_paternal"] = "Last name (paternal) is required"
	}
	if len(details) > 0 {
		return c.Render(http.StatusBadRequest, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Validation error",
			ErrorCode: "VALIDATION_ERROR",
			Details:   details,
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

	// Actualizar usuario
	user.FirstName = req.FirstName
	user.LastNamePaternal = req.LastNamePaternal
	if req.LastNameMaternal != "" {
		user.LastNameMaternal = &req.LastNameMaternal
	} else {
		user.LastNameMaternal = nil
	}

	if err := tx.Update(user); err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(ErrorResponse{
			Success:   false,
			Error:     "Failed to update profile",
			ErrorCode: "INTERNAL_ERROR",
		}))
	}

	// Respuesta
	var resp UpdateProfileResponse
	resp.Success = true
	resp.Message = "Profile updated successfully"
	resp.Data.ID = user.ID.String()
	resp.Data.Email = user.Email
	resp.Data.FirstName = user.FirstName
	resp.Data.LastNamePaternal = user.LastNamePaternal
	resp.Data.LastNameMaternal = user.LastNameMaternal

	return c.Render(http.StatusOK, r.JSON(resp))
}
