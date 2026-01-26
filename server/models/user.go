package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type User struct {
	ID uuid.UUID `db:"id" json:"id"`

	Email         string `db:"email" json:"email"`
	EmailVerified bool   `db:"email_verified" json:"email_verified"`

	// No exponer en JSON
	PasswordHash *string `db:"password_hash" json:"-"`

	FirstName        string  `db:"first_name" json:"first_name"`
	LastNamePaternal string  `db:"last_name_paternal" json:"last_name_paternal"`
	LastNameMaternal *string `db:"last_name_maternal" json:"last_name_maternal,omitempty"`

	Role   string `db:"role" json:"role"`
	Active bool   `db:"active" json:"active"`

	TwoFactorEnabled bool    `db:"two_factor_enabled" json:"two_factor_enabled"`
	TwoFactorSecret  *string `db:"two_factor_secret" json:"-"`

	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at" json:"updated_at"`
	LastLoginAt *time.Time `db:"last_login_at" json:"last_login_at,omitempty"`
}

func (u User) TableName() string { return "auth.users" }

type Users []User
