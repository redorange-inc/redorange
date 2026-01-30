'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword, setPassword } from '@/lib/auth/api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'La contraseña actual es requerida'),
    new_password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  });

const setPasswordSchema = z
  .object({
    new_password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

interface ChangePasswordFormProps {
  hasPassword: boolean;
}

export const ChangePasswordForm = ({ hasPassword }: ChangePasswordFormProps) => {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const setForm = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await changePassword({ current_password: data.current_password, new_password: data.new_password });

      if (response.success) {
        setSuccess(true);
        changeForm.reset();
        setTimeout(() => setSuccess(false), 3000);
      } else setError(response.error || 'Error al cambiar contraseña');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSetPassword = async (data: SetPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await setPassword({ password: data.new_password });

      if (response.success) {
        setSuccess(true);
        setForm.reset();
        await refreshUser();
        setTimeout(() => setSuccess(false), 3000);
      } else setError(response.error || 'Error al establecer contraseña');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 text-green-500">
          <Check className="h-4 w-4" />
          <AlertDescription>{hasPassword ? 'Contraseña cambiada correctamente' : 'Contraseña establecida correctamente'}</AlertDescription>
        </Alert>
      )}

      {hasPassword ? (
        <form onSubmit={changeForm.handleSubmit(onChangePassword)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Contraseña Actual</Label>
            <Input id="current_password" type="password" {...changeForm.register('current_password')} disabled={isLoading} />
            {changeForm.formState.errors.current_password && <p className="text-sm text-destructive">{changeForm.formState.errors.current_password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">Nueva Contraseña</Label>
            <Input id="new_password" type="password" {...changeForm.register('new_password')} disabled={isLoading} />
            {changeForm.formState.errors.new_password && <p className="text-sm text-destructive">{changeForm.formState.errors.new_password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirmar Nueva Contraseña</Label>
            <Input id="confirm_password" type="password" {...changeForm.register('confirm_password')} disabled={isLoading} />
            {changeForm.formState.errors.confirm_password && <p className="text-sm text-destructive">{changeForm.formState.errors.confirm_password.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cambiar Contraseña
          </Button>
        </form>
      ) : (
        <form onSubmit={setForm.handleSubmit(onSetPassword)} className="space-y-4">
          <p className="text-sm text-muted-foreground">Tu cuenta fue creada con Google. Puedes establecer una contraseña para iniciar sesión también con email y contraseña.</p>

          <div className="space-y-2">
            <Label htmlFor="new_password_set">Nueva Contraseña</Label>
            <Input id="new_password_set" type="password" {...setForm.register('new_password')} disabled={isLoading} />
            {setForm.formState.errors.new_password && <p className="text-sm text-destructive">{setForm.formState.errors.new_password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password_set">Confirmar Contraseña</Label>
            <Input id="confirm_password_set" type="password" {...setForm.register('confirm_password')} disabled={isLoading} />
            {setForm.formState.errors.confirm_password && <p className="text-sm text-destructive">{setForm.formState.errors.confirm_password.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Establecer Contraseña
          </Button>
        </form>
      )}
    </div>
  );
};
