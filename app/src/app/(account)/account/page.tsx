'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Shield, Monitor, Mail, Calendar, Clock, ChevronRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const AccountPage = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/sign-in');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const initials = `${user.name[0]}${user.last_name[0]}`.toUpperCase();
  const fullName = `${user.name} ${user.last_name}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const quickLinks = [
    { title: 'Mi Perfil', description: 'Actualiza tu información personal', href: '/account/profile', icon: User },
    { title: 'Seguridad', description: 'Contraseña y autenticación 2FA', href: '/account/security', icon: Shield },
    { title: 'Sesiones', description: 'Administra tus dispositivos activos', href: '/account/sessions', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Cuenta</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de cuenta</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profile} alt={fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-1 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro desde {formatDate(user.created_at)}</span>
                </div>
                {user.last_login_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Último acceso {formatDate(user.last_login_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user.two_factor_enabled ? (
                <div className="flex items-center gap-1 text-green-600">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">2FA Activo</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600">
                  <ShieldAlert className="h-5 w-5" />
                  <span className="text-sm font-medium">2FA Inactivo</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.href} className="hover:border-primary/50 transition-colors">
              <Link href={link.href}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base">{link.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{link.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estado de Seguridad</CardTitle>
          <CardDescription>Resumen de la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email verificado</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {user.email_verified ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verificado</Badge> : <Badge variant="destructive">No verificado</Badge>}
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Autenticación de dos factores</p>
                  <p className="text-sm text-muted-foreground">Protección adicional para tu cuenta</p>
                </div>
              </div>
              {user.two_factor_enabled ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Activado</Badge>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/account/security">Activar</Link>
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Contraseña</p>
                  <p className="text-sm text-muted-foreground">{user.has_password ? 'Contraseña configurada' : 'Sin contraseña (solo OAuth)'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/security">{user.has_password ? 'Cambiar' : 'Configurar'}</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.oauth_providers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cuentas Vinculadas</CardTitle>
            <CardDescription>Proveedores de inicio de sesión conectados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.oauth_providers.map((provider) => (
                <Badge key={provider} variant="secondary" className="capitalize">
                  {provider}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountPage;
