'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from '@/components/ui/alert-dialog';
import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getSessions, revokeSession, revokeAllSessions } from '@/lib/auth/api';
import type { SessionInfo } from '@/lib/auth/types';
import { Loader2, Monitor, Smartphone, Globe, Trash2, LogOut, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const SessionsList = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSessions();

      if (response.success && response.data) setSessions(response.data.sessions);
      else setError(response.error || 'Error al cargar sesiones');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);

    try {
      const response = await revokeSession(sessionId);

      if (response.success) setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      else setError(response.error || 'Error al revocar sesión');
    } catch {
      setError('Error de conexión');
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setIsLoading(true);

    try {
      const response = await revokeAllSessions(false);

      if (response.success) await loadSessions();
      else setError(response.error || 'Error al revocar sesiones');
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Globe className="h-5 w-5" />;
    if (userAgent.toLowerCase().includes('mobile')) return <Smartphone className="h-5 w-5" />;

    return <Monitor className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {sessions.length > 1 && (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Otras Sesiones
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar otras sesiones?</AlertDialogTitle>
                <AlertDialogDescription>Se cerrarán todas las sesiones excepto la actual. Tendrás que volver a iniciar sesión en otros dispositivos.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevokeAll}>Cerrar Sesiones</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-lg">{getDeviceIcon(session.device_info?.user_agent)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{session.device_info?.ip_address || 'Dispositivo desconocido'}</p>
                    {session.current && (
                      <Badge variant="secondary" className="text-xs">
                        Sesión actual
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Última actividad: {formatDate(session.last_activity_at)}</p>
                  <p className="text-xs text-muted-foreground">Iniciada: {formatDate(session.created_at)}</p>
                </div>
              </div>

              {!session.current && (
                <Button variant="ghost" size="icon" onClick={() => handleRevokeSession(session.id)} disabled={revokingId === session.id}>
                  {revokingId === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No hay sesiones activas</CardContent>
        </Card>
      )}
    </div>
  );
};
