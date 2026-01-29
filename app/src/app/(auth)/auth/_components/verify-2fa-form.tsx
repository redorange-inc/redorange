'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verify2FA, verifyBackupCode, getCurrentUser } from '@/lib/auth/api';
import { useAuthActions, useAuth } from '@/hooks/use-auth';
import { Loader2, Shield, AlertCircle, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const verify2FASchema = z.object({
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

const backupCodeSchema = z.object({
  backup_code: z.string().min(1, 'El código de respaldo es requerido'),
});

type Verify2FAFormData = z.infer<typeof verify2FASchema>;
type BackupCodeFormData = z.infer<typeof backupCodeSchema>;

export const Verify2FAForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRedirectUrl } = useAuthActions();
  const { login: setUser } = useAuth();
  const tempToken = searchParams.get('temp_token');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);

  const totpForm = useForm<Verify2FAFormData>({
    resolver: zodResolver(verify2FASchema),
  });

  const backupForm = useForm<BackupCodeFormData>({
    resolver: zodResolver(backupCodeSchema),
  });

  const handleSuccessfulAuth = async () => {
    // obtener datos del usuario y actualizar el contexto
    const userResponse = await getCurrentUser();
    if (userResponse.success && userResponse.data) setUser(userResponse.data);

    const redirectUrl = getRedirectUrl();
    router.push(redirectUrl);
    router.refresh();
  };

  const onSubmitTOTP = async (data: Verify2FAFormData) => {
    if (!tempToken) {
      setError('Token temporal no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await verify2FA({ temp_token: tempToken, code: data.code });

      if (response.success) await handleSuccessfulAuth();
      else setError(response.error || 'Código inválido');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitBackup = async (data: BackupCodeFormData) => {
    if (!tempToken) {
      setError('Token temporal no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyBackupCode({ temp_token: tempToken, backup_code: data.backup_code });

      if (response.success) await handleSuccessfulAuth();
      else setError(response.error || 'Código de respaldo inválido');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempToken) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sesión Expirada</CardTitle>
          <CardDescription className="text-center text-destructive">Tu sesión ha expirado. Por favor inicia sesión nuevamente.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => router.push('/auth/sign-in')}>Ir a Iniciar Sesión</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">{useBackupCode ? <Key className="h-12 w-12 text-primary" /> : <Shield className="h-12 w-12 text-primary" />}</div>
        <CardTitle className="text-2xl font-bold text-center">Verificación en Dos Pasos</CardTitle>
        <CardDescription className="text-center">{useBackupCode ? 'Ingresa uno de tus códigos de respaldo' : 'Ingresa el código de tu aplicación de autenticación'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {useBackupCode ? (
          <form onSubmit={backupForm.handleSubmit(onSubmitBackup)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup_code">Código de Respaldo</Label>
              <Input id="backup_code" placeholder="XXXX-XXXX" {...backupForm.register('backup_code')} disabled={isLoading} className="text-center text-lg tracking-widest" />
              {backupForm.formState.errors.backup_code && <p className="text-sm text-destructive">{backupForm.formState.errors.backup_code.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verificar
            </Button>
          </form>
        ) : (
          <form onSubmit={totpForm.handleSubmit(onSubmitTOTP)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de 6 Dígitos</Label>
              <Input id="code" placeholder="000000" maxLength={6} {...totpForm.register('code')} disabled={isLoading} className="text-center text-2xl tracking-widest" />
              {totpForm.formState.errors.code && <p className="text-sm text-destructive">{totpForm.formState.errors.code.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verificar
            </Button>
          </form>
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setError(null);
            }}
            disabled={isLoading}
          >
            {useBackupCode ? 'Usar código de autenticación' : '¿No tienes acceso? Usa código de respaldo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
