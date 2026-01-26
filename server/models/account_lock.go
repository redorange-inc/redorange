package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type AccountLock struct {
	ID uuid.UUID `db:"id" json:"id"`

	UserID uuid.UUID `db:"user_id" json:"user_id"`

	LockedUntil time.Time `db:"locked_until" json:"locked_until"`
	Reason      *string   `db:"reason" json:"reason,omitempty"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

func (l AccountLock) TableName() string { return "auth.account_locks" }

type AccountLocks []AccountLock
