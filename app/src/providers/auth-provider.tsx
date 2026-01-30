/* eslint-disable no-console */
'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import type { User, AuthState } from '@/lib/auth/types';
import { getCurrentUser, logout as logoutApi, refreshToken as refreshTokenApi } from '@/lib/auth/api';
import { getAccessToken, hasValidSession, clearTokens, isTokenExpired, getRefreshToken, getTokenTimeRemaining } from '@/lib/auth/tokens';

interface AuthContextType extends AuthState {
  // eslint-disable-next-line no-unused-vars
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // -- limpiar timer de refresh
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // -- programar refresh automatico
  const scheduleTokenRefresh = useCallback(() => {
    clearRefreshTimer();

    const accessToken = getAccessToken();
    if (!accessToken) return;

    const timeRemaining = getTokenTimeRemaining(accessToken);
    // refrescar 60 segundos antes de que expire
    const refreshIn = Math.max(0, (timeRemaining - 60) * 1000);

    console.log(`[AuthProvider] Token refresh scheduled in ${Math.round(refreshIn / 1000)} seconds`);

    refreshTimerRef.current = setTimeout(async () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      console.log('[AuthProvider] Auto-refreshing token...');
      const refreshed = await refreshTokenApi();

      isRefreshingRef.current = false;

      if (refreshed) {
        console.log('[AuthProvider] Token refreshed successfully');
        // eslint-disable-next-line react-hooks/immutability
        scheduleTokenRefresh();
      } else {
        console.log('[AuthProvider] Token refresh failed, logging out');
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    }, refreshIn);
  }, [clearRefreshTimer]);

  // -- cargar usuario
  const loadUser = useCallback(async () => {
    // esperar a que el DOM este listo
    if (typeof window === 'undefined') {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const accessToken = getAccessToken();

    console.log('[AuthProvider] Loading user...');
    console.log('[AuthProvider] Access token exists:', !!accessToken);

    if (!accessToken) {
      console.log('[AuthProvider] No access token, setting unauthenticated');
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // verificar si el token expiro
    if (isTokenExpired(accessToken)) {
      console.log('[AuthProvider] Token expired, attempting refresh...');
      const refresh = getRefreshToken();

      if (refresh) {
        const refreshed = await refreshTokenApi();
        console.log('[AuthProvider] Refresh result:', refreshed);

        if (!refreshed) {
          clearTokens();
          setState({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
      } else {
        console.log('[AuthProvider] No refresh token, clearing...');
        clearTokens();
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
    }

    console.log('[AuthProvider] Fetching current user...');
    const response = await getCurrentUser();
    console.log('[AuthProvider] User response:', response);

    if (response.success && response.data) {
      console.log('[AuthProvider] User loaded successfully:', response.data.email);
      setState({ user: response.data, isAuthenticated: true, isLoading: false });
      // programar refresh automatico
      scheduleTokenRefresh();
    } else {
      console.log('[AuthProvider] Failed to load user:', response.error);
      clearTokens();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [scheduleTokenRefresh]);

  // -- efecto para cargar usuario al montar
  useEffect(() => {
    loadUser();

    return () => {
      clearRefreshTimer();
    };
  }, [loadUser, clearRefreshTimer]);

  // -- login
  const login = useCallback(
    (loginUser: User) => {
      console.log('[AuthProvider] Login called with user:', loginUser.email);
      setState({ user: loginUser, isAuthenticated: true, isLoading: false });
      scheduleTokenRefresh();
    },
    [scheduleTokenRefresh],
  );

  // -- logout
  const logout = useCallback(async () => {
    console.log('[AuthProvider] Logout called');
    clearRefreshTimer();
    await logoutApi();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, [clearRefreshTimer]);

  // -- refrescar usuario
  const refreshUser = useCallback(async () => {
    if (!hasValidSession()) return;

    const response = await getCurrentUser();
    if (response.success && response.data) setState((prev) => ({ ...prev, user: response.data! }));
  }, []);

  return <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};
