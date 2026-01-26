-- server\migrations\20260126154911_010_auth_core.postgres.down.sql

-- Drop triggers
DROP TRIGGER IF EXISTS update_oauth_providers_updated_at ON auth.oauth_providers;
DROP TRIGGER IF EXISTS update_users_updated_at ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS auth.update_updated_at_column();

-- Drop tables in reverse order (respecting dependencies)
DROP TABLE IF EXISTS auth.account_locks;
DROP TABLE IF EXISTS auth.login_attempts;
DROP TABLE IF EXISTS auth.verification_tokens;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.two_factor_backup_codes;
DROP TABLE IF EXISTS auth.oauth_providers;
DROP TABLE IF EXISTS auth.users;