'use client';

import { useAuth } from '@/hooks/use-auth';
import { ChangePasswordForm } from './change-password-form';
import { TwoFactorSettings } from './two-factor-settings';
import { LinkedAccounts } from './linked-accounts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Link2 } from 'lucide-react';

export const SecuritySettings = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Contraseña</CardTitle>
          </div>
          <CardDescription>{user.has_password ? 'Cambia tu contraseña actual' : 'Establece una contraseña para tu cuenta'}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm hasPassword={user.has_password} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Autenticación de Dos Factores</CardTitle>
            </div>
            <Badge variant={user.two_factor_enabled ? 'default' : 'secondary'}>{user.two_factor_enabled ? 'Activado' : 'Desactivado'}</Badge>
          </div>
          <CardDescription>Añade una capa extra de seguridad a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <TwoFactorSettings enabled={user.two_factor_enabled} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            <CardTitle>Cuentas Vinculadas</CardTitle>
          </div>
          <CardDescription>Administra las cuentas externas vinculadas</CardDescription>
        </CardHeader>
        <CardContent>
          <LinkedAccounts providers={user.oauth_providers} hasPassword={user.has_password} />
        </CardContent>
      </Card>
    </div>
  );
};
