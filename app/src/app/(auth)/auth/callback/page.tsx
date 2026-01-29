'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setTokens } from '@/lib/auth/tokens';
import { useAuthActions } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRedirectUrl } = useAuthActions();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const tempToken = searchParams.get('temp_token');
    const requires2FA = searchParams.get('requires_2fa');
    const error = searchParams.get('error');

    if (error) {
      router.push(`/auth/sign-in?error=${error}`);
      return;
    }

    if (requires2FA && tempToken) {
      router.push(`/auth/verify-2fa?temp_token=${tempToken}`);
      return;
    }

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      const redirectUrl = getRedirectUrl();
      router.push(redirectUrl);
      return;
    }

    router.push('/auth/sign-in?error=invalid_callback');
  }, [searchParams, router, getRedirectUrl]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Procesando autenticación...</p>
    </div>
  );
};

export default CallbackPage;
