package models

import (
	"time"

	"github.com/gofrs/uuid"
)

type OAuthProvider struct {
	ID uuid.UUID `db:"id" json:"id"`

	UserID uuid.UUID `db:"user_id" json:"user_id"`

	Provider       string `db:"provider" json:"provider"`                 // google, github, etc.
	ProviderUserID string `db:"provider_user_id" json:"provider_user_id"` // id externo

	// Tokens NO se exponen en JSON por seguridad
	AccessToken  *string `db:"access_token" json:"-"`
	RefreshToken *string `db:"refresh_token" json:"-"`
	ExpiresAt    *time.Time `db:"expires_at" json:"expires_at,omitempty"`

	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

func (o OAuthProvider) TableName() string { return "auth.oauth_providers" }

type OAuthProviders []OAuthProvider
