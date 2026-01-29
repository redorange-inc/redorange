'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { register as registerApi } from '@/lib/auth/api';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signUpSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
    first_name: z.string().min(1, 'El nombre es requerido'),
    last_name_paternal: z.string().min(1, 'El apellido paterno es requerido'),
    last_name_maternal: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerApi({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name_paternal: data.last_name_paternal,
        last_name_maternal: data.last_name_maternal,
        role: 'support',
      });

      if (!response.success) {
        if (response.error_code === 'EMAIL_ALREADY_EXISTS') {
          setError('Este email ya está registrado');
        } else {
          setError(response.error || 'Error al registrar');
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">¡Registro Exitoso!</CardTitle>
          <CardDescription className="text-center">Hemos enviado un enlace de verificación a tu email. Por favor revisa tu bandeja de entrada.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/auth/sign-in')}>Ir a Iniciar Sesión</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
        <CardDescription className="text-center">Completa los datos para registrarte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="first_name" placeholder="Juan" className="pl-10" {...register('first_name')} disabled={isLoading} />
              </div>
              {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name_paternal">Apellido Paterno</Label>
              <Input id="last_name_paternal" placeholder="Pérez" {...register('last_name_paternal')} disabled={isLoading} />
              {errors.last_name_paternal && <p className="text-sm text-destructive">{errors.last_name_paternal.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name_maternal">Apellido Materno (Opcional)</Label>
            <Input id="last_name_maternal" placeholder="García" {...register('last_name_maternal')} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" {...register('email')} disabled={isLoading} />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register('password')} disabled={isLoading} />
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" {...register('confirmPassword')} disabled={isLoading} />
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrarse
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
