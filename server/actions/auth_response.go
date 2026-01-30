package actions

type ErrorResponse struct {
	Success   bool           `json:"success"`
	Error     string         `json:"error"`
	ErrorCode string         `json:"error_code,omitempty"`
	Details   map[string]any `json:"details,omitempty"`
}
