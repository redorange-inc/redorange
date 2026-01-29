'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { requestPasswordReset } from '@/lib/auth/api';
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await requestPasswordReset(data);
      setSuccess(true);
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
          <CardTitle className="text-2xl font-bold text-center">Revisa tu Email</CardTitle>
          <CardDescription className="text-center">Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/auth/sign-in">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Iniciar Sesión
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">¿Olvidaste tu Contraseña?</CardTitle>
        <CardDescription className="text-center">Ingresa tu email y te enviaremos un enlace para restablecerla</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" {...register('email')} disabled={isLoading} />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Enlace
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/auth/sign-in" className="text-sm text-primary hover:underline">
          <ArrowLeft className="inline mr-1 h-4 w-4" />
          Volver a Iniciar Sesión
        </Link>
      </CardFooter>
    </Card>
  );
};
