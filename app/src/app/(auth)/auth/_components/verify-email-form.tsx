'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyEmail } from '@/lib/auth/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      setError('Token de verificación no encontrado');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail({ token });

        if (response.success) setStatus('success');
        else {
          setStatus('error');
          setError(response.error || 'Error al verificar email');
        }
      } catch {
        setStatus('error');
        setError('Error de conexión');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <Card>
      <CardHeader className="space-y-1">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verificando Email</CardTitle>
            <CardDescription className="text-center">Por favor espera mientras verificamos tu email...</CardDescription>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">¡Email Verificado!</CardTitle>
            <CardDescription className="text-center">Tu email ha sido verificado correctamente. Ya puedes iniciar sesión.</CardDescription>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Error de Verificación</CardTitle>
            <CardDescription className="text-center text-destructive">{error}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardFooter className="flex justify-center">{status !== 'loading' && <Button onClick={() => router.push('/auth/sign-in')}>Ir a Iniciar Sesión</Button>}</CardFooter>
    </Card>
  );
};
