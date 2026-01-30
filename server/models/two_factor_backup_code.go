package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type TwoFactorBackupCode struct {
	ID uuid.UUID `db:"id" json:"id"`

	UserID uuid.UUID `db:"user_id" json:"user_id"`

	// No exponer hash
	CodeHash string `db:"code_hash" json:"-"`

	Used   bool      `db:"used" json:"used"`
	UsedAt *time.Time `db:"used_at" json:"used_at,omitempty"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

func (c TwoFactorBackupCode) TableName() string { return "auth.two_factor_backup_codes" }

type TwoFactorBackupCodes []TwoFactorBackupCode
