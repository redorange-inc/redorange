package models

import (
	"encoding/json"
	"time"

	"github.com/gofrs/uuid"
)

type Session struct {
	ID uuid.UUID `db:"id" json:"id"`

	UserID uuid.UUID `db:"user_id" json:"user_id"`

	// No exponer hash
	RefreshTokenHash string `db:"refresh_token_hash" json:"-"`

	// JSONB
	DeviceInfo json.RawMessage `db:"device_info" json:"device_info,omitempty"`

	ExpiresAt       time.Time `db:"expires_at" json:"expires_at"`
	CreatedAt       time.Time `db:"created_at" json:"created_at"`
	LastActivityAt  time.Time `db:"last_activity_at" json:"last_activity_at"`

	Revoked   bool      `db:"revoked" json:"revoked"`
	RevokedAt *time.Time `db:"revoked_at" json:"revoked_at,omitempty"`
}

func (s Session) TableName() string { return "auth.sessions" }

type Sessions []Session
