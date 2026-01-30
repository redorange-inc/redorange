import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
import type { JWTPayload } from './types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_ORIGIN_KEY = 'auth_origin';

const cookieOptions: Cookies.CookieAttributes = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// -- access token

export const setAccessToken = (token: string): void => {
  try {
    const payload = decodeJwt(token) as JWTPayload;
    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
    const expiresDays = expiresIn / (60 * 60 * 24);

    Cookies.set(ACCESS_TOKEN_KEY, token, { ...cookieOptions, expires: expiresDays > 0 ? expiresDays : 1 / 96 });
  } catch {
    Cookies.set(ACCESS_TOKEN_KEY, token, { ...cookieOptions, expires: 1 / 96 });
  }
};

export const getAccessToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
};

// -- refresh token

export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { ...cookieOptions, expires: 7 });
};

export const getRefreshToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
};

// -- auth origin

export const setAuthOrigin = (origin: string): void => {
  Cookies.set(AUTH_ORIGIN_KEY, origin, { ...cookieOptions, expires: 1 / 24 });
};

export const getAuthOrigin = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(AUTH_ORIGIN_KEY);
};

export const removeAuthOrigin = (): void => {
  Cookies.remove(AUTH_ORIGIN_KEY, { path: '/' });
};

// -- helpers

export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
  removeAuthOrigin();
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJwt(token) as JWTPayload;
    const now = Math.floor(Date.now() / 1000);
    // agregar 30 segundos de margen para evitar race conditions
    return payload.exp < now + 30;
  } catch {
    return true;
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return decodeJwt(token) as JWTPayload;
  } catch {
    return null;
  }
};

export const hasValidSession = (): boolean => {
  const accessToken = getAccessToken();
  if (!accessToken) return false;
  return !isTokenExpired(accessToken);
};

// -- obtener tiempo restante del token en segundos
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = decodeJwt(token) as JWTPayload;
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  } catch {
    return 0;
  }
};
