export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  name: string;
  last_name: string;
  profile?: string;
  role: 'support' | 'admin' | 'dev';
  active: boolean;
  two_factor_enabled: boolean;
  oauth_providers: string[];
  has_password: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface LoginUser {
  id: string;
  email: string;
  name: string;
  last_name: string;
  profile?: string;
  role: string;
  two_factor_enabled: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// -- request types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  last_name: string;
  role?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface Verify2FARequest {
  temp_token: string;
  code: string;
}

export interface VerifyBackupCodeRequest {
  temp_token: string;
  backup_code: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface SetPasswordRequest {
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  last_name?: string;
  profile?: string;
}

export interface Enable2FAVerifyRequest {
  setup_token: string;
  code: string;
}

export interface Disable2FARequest {
  password: string;
  code: string;
}

export interface Regenerate2FABackupCodesRequest {
  code: string;
}

// -- response types

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  error_code?: string;
  details?: Record<string, string>;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: LoginUser;
}

export interface Login2FAResponse {
  temp_token: string;
  message: string;
}

export interface LoginApiResponse {
  success: boolean;
  requires_2fa?: boolean;
  data?: LoginResponse | Login2FAResponse;
  error?: string;
  error_code?: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  email_verified: boolean;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Enable2FAResponse {
  secret: string;
  qr_code: string;
  setup_token: string;
  backup_codes: string[];
}

export interface RegenerateBackupCodesResponse {
  backup_codes: string[];
}

export interface BackupCodesStatusResponse {
  total_codes: number;
  used_codes: number;
  remaining_codes: number;
}

export interface SessionInfo {
  id: string;
  device_info: {
    user_agent?: string;
    ip_address?: string;
  };
  created_at: string;
  last_activity_at: string;
  current: boolean;
}

export interface LoginAttemptInfo {
  id: string;
  success: boolean;
  failure_reason?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AccountStatus {
  exists: boolean;
  has_password: boolean;
  two_factor_enabled: boolean;
  oauth_providers: string[];
  account_locked: boolean;
  locked_until?: string;
}

// -- jwt payload (decoded from access_token)

export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  token_type: string;
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
}

// -- redirect origins

export type AuthOrigin = 'tech' | 'infra' | 'digital' | 'public';
