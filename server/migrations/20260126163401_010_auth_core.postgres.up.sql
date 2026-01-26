-- server\migrations\20260126154911_010_auth_core.postgres.up.sql

-- Main users table
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255), -- NULL for OAuth-only users
    
    -- Personal data
    first_name VARCHAR(100) NOT NULL,
    last_name_paternal VARCHAR(100) NOT NULL,
    last_name_maternal VARCHAR(100),
    
    -- Role and status
    role VARCHAR(20) NOT NULL CHECK (role IN ('support', 'admin', 'dev')),
    active BOOLEAN DEFAULT TRUE,
    
    -- Two-factor authentication
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255), -- Secret for TOTP
    
    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_users_active ON auth.users(active);

-- OAuth providers table (Google, etc.)
CREATE TABLE auth.oauth_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'github', etc.
    provider_user_id VARCHAR(255) NOT NULL, -- User ID in the provider
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_user_id ON auth.oauth_providers(user_id);
CREATE INDEX idx_oauth_provider ON auth.oauth_providers(provider, provider_user_id);

-- Two-factor backup codes table
CREATE TABLE auth.two_factor_backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backup_codes_user_id ON auth.two_factor_backup_codes(user_id);

-- Sessions table (for JWT refresh tokens or server sessions)
CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info JSONB, -- User-Agent, IP, etc.
    
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON auth.sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires_at ON auth.sessions(expires_at);
CREATE INDEX idx_sessions_active ON auth.sessions(user_id, revoked, expires_at);

-- Verification tokens table (email, password reset, etc.)
CREATE TABLE auth.verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255), -- For email verification before creating user
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    token_type VARCHAR(50) NOT NULL, -- 'email_verification', 'password_reset', '2fa_setup'
    
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP
);

CREATE INDEX idx_verification_tokens_hash ON auth.verification_tokens(token_hash);
CREATE INDEX idx_verification_tokens_user_id ON auth.verification_tokens(user_id);
CREATE INDEX idx_verification_tokens_expires ON auth.verification_tokens(expires_at, used);

-- Login attempts audit table
CREATE TABLE auth.login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100), -- 'invalid_password', 'account_locked', '2fa_failed', etc.
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email ON auth.login_attempts(email, created_at);
CREATE INDEX idx_login_attempts_user_id ON auth.login_attempts(user_id, created_at);
CREATE INDEX idx_login_attempts_ip ON auth.login_attempts(ip_address, created_at);

-- Account locks table for failed attempts
CREATE TABLE auth.account_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    locked_until TIMESTAMP NOT NULL,
    reason VARCHAR(255),
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id)
);

CREATE INDEX idx_account_locks_user_id ON auth.account_locks(user_id, locked_until);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

CREATE TRIGGER update_oauth_providers_updated_at BEFORE UPDATE ON auth.oauth_providers
    FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

-- Table comments
COMMENT ON TABLE auth.users IS 'Main users table';
COMMENT ON TABLE auth.oauth_providers IS 'OAuth providers linked to users';
COMMENT ON TABLE auth.two_factor_backup_codes IS 'Backup codes for 2FA';
COMMENT ON TABLE auth.sessions IS 'Active sessions and refresh tokens';
COMMENT ON TABLE auth.verification_tokens IS 'Tokens for email verification and password reset';
COMMENT ON TABLE auth.login_attempts IS 'Login attempts audit';
COMMENT ON TABLE auth.account_locks IS 'Temporary account lock control';