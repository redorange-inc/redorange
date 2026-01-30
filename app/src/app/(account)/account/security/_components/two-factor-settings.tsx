'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { enable2FA, verify2FAEnable, disable2FA, regenerateBackupCodes } from '@/lib/auth/api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Shield, ShieldOff, Copy, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Enable2FAResponse } from '@/lib/auth/types';

const verifySchema = z.object({ code: z.string().length(6, 'El código debe tener 6 dígitos') });

const disableSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida'),
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

type VerifyFormData = z.infer<typeof verifySchema>;
type DisableFormData = z.infer<typeof disableSchema>;

interface TwoFactorSettingsProps {
  enabled: boolean;
}

export const TwoFactorSettings = ({ enabled }: TwoFactorSettingsProps) => {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<Enable2FAResponse | null>(null);
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const disableForm = useForm<DisableFormData>({
    resolver: zodResolver(disableSchema),
  });

  const handleEnable = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await enable2FA();

      if (response.success && response.data) {
        setSetupData(response.data);
        setShowEnableDialog(true);
      } else setError(response.error || 'Error al iniciar configuración 2FA');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEnable = async (data: VerifyFormData) => {
    if (!setupData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await verify2FAEnable({
        setup_token: setupData.setup_token,
        code: data.code,
      });

      if (response.success) {
        setBackupCodes(setupData.backup_codes);
        setShowEnableDialog(false);
        setShowBackupCodes(true);
        await refreshUser();
      } else setError(response.error || 'Código inválido');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async (data: DisableFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await disable2FA(data);

      if (response.success) {
        setShowDisableDialog(false);
        await refreshUser();
      } else setError(response.error || 'Error al desactivar 2FA');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const code = prompt('Ingresa tu código 2FA actual para regenerar códigos de respaldo:');
    if (!code) return;

    setIsLoading(true);

    try {
      const response = await regenerateBackupCodes({ code });

      if (response.success && response.data) {
        setBackupCodes(response.data.backup_codes);
        setShowBackupCodes(true);
      } else alert(response.error || 'Error al regenerar códigos');
    } catch {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {enabled ? (
        <>
          <p className="text-sm text-muted-foreground">La autenticación de dos factores está activada. Tu cuenta está protegida con un código adicional al iniciar sesión.</p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRegenerateBackupCodes} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Regenerar Códigos de Respaldo
            </Button>

            <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Desactivar 2FA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Desactivar Autenticación de Dos Factores</DialogTitle>
                  <DialogDescription>Ingresa tu contraseña y código actual para desactivar 2FA</DialogDescription>
                </DialogHeader>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={disableForm.handleSubmit(handleDisable)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="disable_password">Contraseña</Label>
                    <Input id="disable_password" type="password" {...disableForm.register('password')} disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disable_code">Código 2FA</Label>
                    <Input id="disable_code" placeholder="000000" maxLength={6} {...disableForm.register('code')} disabled={isLoading} className="text-center tracking-widest" />
                  </div>

                  <Button type="submit" variant="destructive" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Desactivar 2FA
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta requiriendo un código de tu aplicación de autenticación además de tu contraseña.</p>

          <Button onClick={handleEnable} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Shield className="mr-2 h-4 w-4" />
            Activar 2FA
          </Button>
        </>
      )}

      <Dialog open={showEnableDialog} onOpenChange={setShowEnableDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Autenticación de Dos Factores</DialogTitle>
            <DialogDescription>Escanea el código QR con tu aplicación de autenticación</DialogDescription>
          </DialogHeader>

          {setupData && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image src={setupData.qr_code} alt="QR Code" width={192} height={192} className="w-48 h-48" unoptimized />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">O ingresa este código manualmente:</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">{setupData.secret}</code>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={verifyForm.handleSubmit(handleVerifyEnable)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify_code">Código de Verificación</Label>
                  <Input id="verify_code" placeholder="000000" maxLength={6} {...verifyForm.register('code')} disabled={isLoading} className="text-center text-xl tracking-widest" />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verificar y Activar
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Códigos de Respaldo</DialogTitle>
            <DialogDescription>Guarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <code className="text-sm">{code}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(code, index)}>
                    {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" onClick={copyAllCodes}>
              {copiedIndex === -1 ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copiar Todos
            </Button>

            <Button className="w-full" onClick={() => setShowBackupCodes(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
