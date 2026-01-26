package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type VerificationToken struct {
	ID uuid.UUID `db:"id" json:"id"`

	UserID *uuid.UUID `db:"user_id" json:"user_id,omitempty"` // puede ser null
	Email  *string    `db:"email" json:"email,omitempty"`

	// No exponer hash
	TokenHash string `db:"token_hash" json:"-"`

	TokenType string `db:"token_type" json:"token_type"` // email_verification, password_reset, 2fa_setup

	ExpiresAt time.Time `db:"expires_at" json:"expires_at"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`

	Used   bool      `db:"used" json:"used"`
	UsedAt *time.Time `db:"used_at" json:"used_at,omitempty"`
}

func (t VerificationToken) TableName() string { return "auth.verification_tokens" }

type VerificationTokens []VerificationToken
