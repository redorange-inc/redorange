'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { unlinkGoogleAccount, getGoogleOAuthUrl } from '@/lib/auth/api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Link2, Unlink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LinkedAccountsProps {
  providers: string[];
  hasPassword: boolean;
}

export const LinkedAccounts = ({ providers, hasPassword }: LinkedAccountsProps) => {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [password, setPassword] = useState('');

  const hasGoogle = providers.includes('google');

  const handleLinkGoogle = () => {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    const googleUrl = getGoogleOAuthUrl(callbackUrl);
    window.location.href = googleUrl;
  };

  const handleUnlinkGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await unlinkGoogleAccount(hasPassword ? password : undefined);

      if (response.success) {
        setShowUnlinkDialog(false);
        setPassword('');
        await refreshUser();
      } else setError(response.error || 'Error al desvincular cuenta');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <div>
            <p className="font-medium">Google</p>
            <p className="text-sm text-muted-foreground">{hasGoogle ? 'Cuenta vinculada' : 'No vinculada'}</p>
          </div>
        </div>

        {hasGoogle ? (
          <Button variant="outline" size="sm" onClick={() => setShowUnlinkDialog(true)}>
            <Unlink className="mr-2 h-4 w-4" />
            Desvincular
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleLinkGoogle}>
            <Link2 className="mr-2 h-4 w-4" />
            Vincular
          </Button>
        )}
      </div>

      <Dialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desvincular Cuenta de Google</DialogTitle>
            <DialogDescription>{hasPassword ? 'Ingresa tu contraseña para confirmar' : '¿Estás seguro de que deseas desvincular tu cuenta de Google?'}</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!hasPassword && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Debes establecer una contraseña antes de desvincular Google, de lo contrario no podrás acceder a tu cuenta.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="unlink_password">Contraseña</Label>
                <Input id="unlink_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowUnlinkDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleUnlinkGoogle} disabled={isLoading || (hasPassword && !password)}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Desvincular
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
