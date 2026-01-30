--
-- PostgreSQL database dump
--

\restrict BB9xVKuP8Me2PfLN4pxYhFVJiIoCd6UV9gMFMUQbRDCUrJ54iPZwHfSnmRTaVCV

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- Name: digital; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA digital;


ALTER SCHEMA digital OWNER TO postgres;

--
-- Name: infra; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA infra;


ALTER SCHEMA infra OWNER TO postgres;

--
-- Name: tech; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tech;


ALTER SCHEMA tech OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION auth.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_locks; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.account_locks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    locked_until timestamp without time zone NOT NULL,
    reason character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE auth.account_locks OWNER TO postgres;

--
-- Name: TABLE account_locks; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.account_locks IS 'temporary account lock control';


--
-- Name: login_attempts; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.login_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255),
    user_id uuid,
    success boolean NOT NULL,
    failure_reason character varying(100),
    ip_address inet,
    user_agent text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE auth.login_attempts OWNER TO postgres;

--
-- Name: TABLE login_attempts; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.login_attempts IS 'login attempts audit';


--
-- Name: oauth_providers; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    provider character varying(50) NOT NULL,
    provider_user_id character varying(255) NOT NULL,
    provider_email character varying(255),
    access_token text,
    refresh_token text,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE auth.oauth_providers OWNER TO postgres;

--
-- Name: TABLE oauth_providers; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.oauth_providers IS 'oauth providers linked to users';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    refresh_token_hash character varying(255) NOT NULL,
    device_info jsonb,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_activity_at timestamp without time zone DEFAULT now() NOT NULL,
    revoked boolean DEFAULT false,
    revoked_at timestamp without time zone
);


ALTER TABLE auth.sessions OWNER TO postgres;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.sessions IS 'active sessions and refresh tokens';


--
-- Name: two_factor_backup_codes; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.two_factor_backup_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    code_hash character varying(255) NOT NULL,
    used boolean DEFAULT false,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE auth.two_factor_backup_codes OWNER TO postgres;

--
-- Name: TABLE two_factor_backup_codes; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.two_factor_backup_codes IS 'backup codes for 2fa';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    email_verified boolean DEFAULT false,
    password_hash character varying(255),
    name character varying(100) NOT NULL,
    last_name character varying(200) NOT NULL,
    profile character varying(500),
    role character varying(20) NOT NULL,
    active boolean DEFAULT true,
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    last_login_at timestamp without time zone,
    CONSTRAINT email_format CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['support'::character varying, 'admin'::character varying, 'dev'::character varying])::text[])))
);


ALTER TABLE auth.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.users IS 'main users table';


--
-- Name: verification_tokens; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.verification_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email character varying(255),
    token_hash character varying(255) NOT NULL,
    token_type character varying(50) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    used boolean DEFAULT false,
    used_at timestamp without time zone
);


ALTER TABLE auth.verification_tokens OWNER TO postgres;

--
-- Name: TABLE verification_tokens; Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON TABLE auth.verification_tokens IS 'tokens for email verification and password reset';


--
-- Name: schema_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migration (
    version character varying(14) NOT NULL
);


ALTER TABLE public.schema_migration OWNER TO postgres;

--
-- Name: account_locks account_locks_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_locks
    ADD CONSTRAINT account_locks_pkey PRIMARY KEY (id);


--
-- Name: account_locks account_locks_user_id_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_locks
    ADD CONSTRAINT account_locks_user_id_key UNIQUE (user_id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: oauth_providers oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.oauth_providers
    ADD CONSTRAINT oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: oauth_providers oauth_providers_provider_provider_user_id_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.oauth_providers
    ADD CONSTRAINT oauth_providers_provider_provider_user_id_key UNIQUE (provider, provider_user_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: two_factor_backup_codes two_factor_backup_codes_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.two_factor_backup_codes
    ADD CONSTRAINT two_factor_backup_codes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: verification_tokens verification_tokens_token_hash_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.verification_tokens
    ADD CONSTRAINT verification_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: schema_migration schema_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schema_migration
    ADD CONSTRAINT schema_migration_pkey PRIMARY KEY (version);


--
-- Name: idx_account_locks_user_id; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_account_locks_user_id ON auth.account_locks USING btree (user_id, locked_until);


--
-- Name: idx_backup_codes_user_id; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_backup_codes_user_id ON auth.two_factor_backup_codes USING btree (user_id);


--
-- Name: idx_login_attempts_email; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_login_attempts_email ON auth.login_attempts USING btree (email, created_at);


--
-- Name: idx_login_attempts_ip; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_login_attempts_ip ON auth.login_attempts USING btree (ip_address, created_at);


--
-- Name: idx_login_attempts_user_id; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_login_attempts_user_id ON auth.login_attempts USING btree (user_id, created_at);


--
-- Name: idx_oauth_provider; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_oauth_provider ON auth.oauth_providers USING btree (provider, provider_user_id);


--
-- Name: idx_oauth_user_id; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_oauth_user_id ON auth.oauth_providers USING btree (user_id);


--
-- Name: idx_sessions_active; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_sessions_active ON auth.sessions USING btree (user_id, revoked, expires_at);


--
-- Name: idx_sessions_expires_at; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_sessions_expires_at ON auth.sessions USING btree (expires_at);


--
-- Name: idx_sessions_token_hash; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_sessions_token_hash ON auth.sessions USING btree (refresh_token_hash);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_sessions_user_id ON auth.sessions USING btree (user_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_users_active ON auth.users USING btree (active);


--
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_users_email ON auth.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_users_role ON auth.users USING btree (role);


--
-- Name: idx_verification_tokens_expires; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_verification_tokens_expires ON auth.verification_tokens USING btree (expires_at, used);


--
-- Name: idx_verification_tokens_hash; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_verification_tokens_hash ON auth.verification_tokens USING btree (token_hash);


--
-- Name: idx_verification_tokens_user_id; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX idx_verification_tokens_user_id ON auth.verification_tokens USING btree (user_id);


--
-- Name: schema_migration_version_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schema_migration_version_idx ON public.schema_migration USING btree (version);


--
-- Name: oauth_providers update_oauth_providers_updated_at; Type: TRIGGER; Schema: auth; Owner: postgres
--

CREATE TRIGGER update_oauth_providers_updated_at BEFORE UPDATE ON auth.oauth_providers FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: auth; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();


--
-- Name: account_locks account_locks_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.account_locks
    ADD CONSTRAINT account_locks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: login_attempts login_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.login_attempts
    ADD CONSTRAINT login_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: oauth_providers oauth_providers_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.oauth_providers
    ADD CONSTRAINT oauth_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: two_factor_backup_codes two_factor_backup_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.two_factor_backup_codes
    ADD CONSTRAINT two_factor_backup_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: verification_tokens verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.verification_tokens
    ADD CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict BB9xVKuP8Me2PfLN4pxYhFVJiIoCd6UV9gMFMUQbRDCUrJ54iPZwHfSnmRTaVCV

