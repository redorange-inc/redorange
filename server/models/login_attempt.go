package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type LoginAttempt struct {
	ID uuid.UUID `db:"id" json:"id"`

	Email  *string    `db:"email" json:"email,omitempty"`
	UserID *uuid.UUID `db:"user_id" json:"user_id,omitempty"`

	Success       bool    `db:"success" json:"success"`
	FailureReason *string `db:"failure_reason" json:"failure_reason,omitempty"`

	// INET lo representamos como string
	IPAddress *string `db:"ip_address" json:"ip_address,omitempty"`
	UserAgent *string `db:"user_agent" json:"user_agent,omitempty"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

func (a LoginAttempt) TableName() string { return "auth.login_attempts" }

type LoginAttempts []LoginAttempt
