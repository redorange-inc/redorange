'use client';

import { useAuth } from '@/providers/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { setAuthOrigin, getAuthOrigin, removeAuthOrigin } from '@/lib/auth/tokens';
import type { AuthOrigin } from '@/lib/auth/types';

const ORIGIN_ROUTES: Record<AuthOrigin, string> = {
  tech: '/tech',
  infra: '/infra',
  digital: '/digital',
  public: '/',
};

const PATH_PREFIXES: { prefix: string; origin: AuthOrigin }[] = [
  { prefix: '/tech', origin: 'tech' },
  { prefix: '/infra', origin: 'infra' },
  { prefix: '/digital', origin: 'digital' },
];

export const useAuthActions = () => {
  const { logout: contextLogout, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const detectOrigin = useCallback((): AuthOrigin => {
    const match = PATH_PREFIXES.find(({ prefix }) => pathname.startsWith(prefix));
    return match?.origin ?? 'public';
  }, [pathname]);

  const goToLogin = useCallback(() => {
    const origin = detectOrigin();
    setAuthOrigin(origin);
    router.push('/auth/sign-in');
  }, [detectOrigin, router]);

  const getRedirectUrl = useCallback((): string => {
    const origin = getAuthOrigin() as AuthOrigin | undefined;
    removeAuthOrigin();
    return ORIGIN_ROUTES[origin ?? 'public'];
  }, []);

  const logout = useCallback(async () => {
    await contextLogout();
    const origin = detectOrigin();
    router.push(ORIGIN_ROUTES[origin]);
  }, [contextLogout, detectOrigin, router]);

  return { isAuthenticated, user, goToLogin, logout, getRedirectUrl, detectOrigin };
};

export { useAuth } from '@/providers/auth-provider';
