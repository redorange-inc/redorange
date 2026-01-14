'use client';

import type { FC } from 'react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, ArrowRight } from 'lucide-react';

export const ContactSection: FC = () => {
  //  mailto built on client
  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Cotización / Solicitud de información - Red Orange');
    const body = encodeURIComponent(
      'Hola Red Orange,\n\nMe gustaría solicitar una cotización sobre:\n\n- Línea de servicio: (IT / Digital / Infra)\n- Empresa/Entidad:\n- Plazo estimado:\n- Detalles:\n\nGracias.',
    );
    return `mailto:ventas@redorange.net.pe?subject=${subject}&body=${body}`;
  }, []);

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-28 md:pt-24 min-h-screen scroll-mt-28">
      {/*  section header */}
      <div className="mb-10 flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold md:text-3xl">Contacto y cotizaciones</h2>
        <p className="max-w-3xl text-muted-foreground">Compártenos tu requerimiento y te enviamos una propuesta con alcance y opciones de servicio.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Formulario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Correo</label>
                <Input type="email" placeholder="tu-correo@dominio.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Asunto</label>
              <Input placeholder="Ej. sistema a medida / web institucional / cableado / internet" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Detalle</label>
              <Textarea placeholder="Describe el alcance, plazos y cualquier información relevante." rows={6} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="font-heading" asChild>
                <a href={mailtoHref}>
                  Enviar por correo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>

              <Button type="button" variant="secondary" className="font-heading" asChild>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#services">
                  Ver servicios
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Nota: este formulario es una maqueta visual. Si deseas, lo conectamos a correo, backend o CRM.</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-xl bg-muted p-4">
              <p className="font-heading text-sm font-bold text-foreground">Razón social</p>
              <p className="mt-1">Red Orange E.I.R.L.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-foreground" />
                  <p className="font-heading text-sm font-bold text-foreground">Correo</p>
                </div>
                <p className="mt-1">ventas@redorange.net.pe</p>
              </div>

              <div className="rounded-xl bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-foreground" />
                  <p className="font-heading text-sm font-bold text-foreground">Teléfono</p>
                </div>
                <p className="mt-1">Agregar número</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted p-4">
              <p className="font-heading text-sm font-bold text-foreground">Cobertura</p>
              <p className="mt-1">Implementación y soporte por proyecto, mensual o por demanda.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
