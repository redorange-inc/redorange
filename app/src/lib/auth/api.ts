import { getAccessToken, getRefreshToken, setTokens, setAccessToken, clearTokens } from './tokens';
import type {
  ApiResponse,
  LoginRequest,
  LoginApiResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  Verify2FARequest,
  VerifyBackupCodeRequest,
  LoginResponse,
  BackupCodesStatusResponse,
} from './types';
import type { RequestPasswordResetRequest, ResetPasswordRequest, RefreshResponse, User, UpdateProfileRequest, ChangePasswordRequest, SetPasswordRequest, Enable2FAResponse } from './types';
import type { Enable2FAVerifyRequest, Disable2FARequest, Regenerate2FABackupCodesRequest, RegenerateBackupCodesResponse, SessionInfo, LoginAttemptInfo, AccountStatus } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

// -- request helper

// eslint-disable-next-line prettier/prettier
const request = async <T,>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const url = `${API_V1}${endpoint}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };

  const accessToken = getAccessToken();
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  try {
    const response = await fetch(url, { ...options, headers });

    const data = await response.json();

    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${getAccessToken()}`;
        const retryResponse = await fetch(url, { ...options, headers });
        return await retryResponse.json();
      }
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      error_code: 'NETWORK_ERROR',
    };
  }
};

// -- authentication

export const login = async (credentials: LoginRequest): Promise<LoginApiResponse> => {
  const response = await request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });

  if (response.success && response.data && 'access_token' in response.data) setTokens(response.data.access_token, response.data.refresh_token);

  return response as LoginApiResponse;
};

export const register = async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  return request<RegisterResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/verify-email', { method: 'POST', body: JSON.stringify(data) });
};

export const logout = async (): Promise<ApiResponse<void>> => {
  const refreshTokenValue = getRefreshToken();

  const response = await request<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: refreshTokenValue }) });

  clearTokens();

  return response;
};

export const refreshToken = async (): Promise<boolean> => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const response = await fetch(`${API_V1}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refresh }) });

    const data: ApiResponse<RefreshResponse> = await response.json();

    if (data.success && data.data) {
      setAccessToken(data.data.access_token);
      return true;
    }

    clearTokens();
    return false;
  } catch {
    clearTokens();
    return false;
  }
};

// -- 2fa

export const verify2FA = async (data: Verify2FARequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await request<LoginResponse>('/auth/2fa/verify', { method: 'POST', body: JSON.stringify(data) });

  if (response.success && response.data) setTokens(response.data.access_token, response.data.refresh_token);

  return response;
};

export const verifyBackupCode = async (data: VerifyBackupCodeRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await request<LoginResponse>('/auth/2fa/verify-backup', { method: 'POST', body: JSON.stringify(data) });

  if (response.success && response.data) setTokens(response.data.access_token, response.data.refresh_token);

  return response;
};

export const enable2FA = async (): Promise<ApiResponse<Enable2FAResponse>> => {
  return request<Enable2FAResponse>('/auth/2fa/enable', { method: 'POST' });
};

export const verify2FAEnable = async (data: Enable2FAVerifyRequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/2fa/verify-enable', { method: 'POST', body: JSON.stringify(data) });
};

export const disable2FA = async (data: Disable2FARequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/2fa/disable', { method: 'POST', body: JSON.stringify(data) });
};

export const regenerateBackupCodes = async (data: Regenerate2FABackupCodesRequest): Promise<ApiResponse<RegenerateBackupCodesResponse>> => {
  return request<RegenerateBackupCodesResponse>('/auth/2fa/regenerate-backup-codes', { method: 'POST', body: JSON.stringify(data) });
};

export const getBackupCodesStatus = async (): Promise<ApiResponse<BackupCodesStatusResponse>> => {
  return request<BackupCodesStatusResponse>('/auth/2fa/backup-codes/status', { method: 'GET' });
};

// -- password

export const requestPasswordReset = async (data: RequestPasswordResetRequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/password/request-reset', { method: 'POST', body: JSON.stringify(data) });
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/password/reset', { method: 'POST', body: JSON.stringify(data) });
};

export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/password/change', { method: 'POST', body: JSON.stringify(data) });
};

export const setPassword = async (data: SetPasswordRequest): Promise<ApiResponse<void>> => {
  return request<void>('/auth/password/set', { method: 'POST', body: JSON.stringify(data) });
};

// -- user

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return request<User>('/auth/me', { method: 'GET' });
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
  return request<User>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
};

export const deleteProfileImage = async (): Promise<ApiResponse<void>> => {
  return request<void>('/auth/me/profile', { method: 'DELETE' });
};

// -- sessions

export const getSessions = async (): Promise<ApiResponse<{ sessions: SessionInfo[] }>> => {
  return request<{ sessions: SessionInfo[] }>('/auth/sessions', { method: 'GET' });
};

export const revokeSession = async (sessionId: string): Promise<ApiResponse<void>> => {
  return request<void>(`/auth/sessions/${sessionId}`, { method: 'DELETE' });
};

export const revokeAllSessions = async (includeCurrent = false): Promise<ApiResponse<{ revoked_count: number }>> => {
  return request<{ revoked_count: number }>('/auth/sessions/all', { method: 'DELETE', body: JSON.stringify({ include_current: includeCurrent }) });
};

// -- security

export const getLoginHistory = async (limit = 20, offset = 0): Promise<ApiResponse<{ total: number; limit: number; offset: number; attempts: LoginAttemptInfo[] }>> => {
  return request(`/auth/security/login-history?limit=${limit}&offset=${offset}`, { method: 'GET' });
};

export const checkAccountStatus = async (email: string): Promise<ApiResponse<AccountStatus>> => {
  return request<AccountStatus>('/auth/security/status', { method: 'POST', body: JSON.stringify({ email }) });
};

// -- oauth

export const getGoogleOAuthUrl = (redirectUri: string): string => {
  return `${API_V1}/auth/oauth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const linkGoogleAccount = async (googleAuthCode: string): Promise<ApiResponse<{ provider: string; provider_email: string }>> => {
  return request('/auth/oauth/google/link', { method: 'POST', body: JSON.stringify({ google_auth_code: googleAuthCode }) });
};

export const unlinkGoogleAccount = async (password?: string): Promise<ApiResponse<void>> => {
  return request('/auth/oauth/google/unlink', { method: 'DELETE', body: JSON.stringify({ password }) });
};
