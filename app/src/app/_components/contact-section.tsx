'use client';

import type { FC } from 'react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const ContactSection: FC = () => {
  //  mailto construido en cliente para evitar encoding manual repetido
  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Cotización / Solicitud de información - Red Orange');
    const body = encodeURIComponent('Hola Red Orange,\n\nMe gustaría solicitar una cotización / información sobre:\n\n- Servicio requerido:\n- Entidad/Empresa:\n- Plazo estimado:\n- Detalles:\n\nGracias.');
    return `mailto:ventas@redorange.net.pe?subject=${subject}&body=${body}`;
  }, []);

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-20 scroll-mt-28">
      {/*  section header */}
      <div className="mb-10 flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold md:text-3xl">Contacto y cotizaciones</h2>
        <p className="max-w-3xl text-muted-foreground">Cuéntanos tu requerimiento y te compartimos una propuesta con alcance, entregables y soporte.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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
              <Input placeholder="Ej. Soporte SIGA / hosting / cableado / sistema a medida" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Detalle</label>
              <Textarea placeholder="Describe el alcance, plazos y cualquier información relevante." rows={6} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="font-heading" asChild>
                <a href={mailtoHref}>Enviar por correo</a>
              </Button>
              <Button type="button" variant="secondary" className="font-heading" asChild>
                <a href="/#it-technology">Ver servicios</a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Nota: este formulario es una maqueta visual. Si deseas, lo conectamos a tu backend, correo o CRM.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-foreground">Razón social</p>
              <p>Red Orange E.I.R.L.</p>
            </div>

            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-foreground">Servicios</p>
              <p>TI y software, web y digital, infraestructura y telecomunicaciones.</p>
            </div>

            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-foreground">Orientación</p>
              <p>Sector público y privado (SIGA, SIAF, SEACE).</p>
            </div>

            <div className="rounded-xl bg-muted p-4">
              <p className="font-heading text-sm font-bold text-foreground">Consejo para SEACE</p>
              <p className="mt-1">Adjunta capturas o enlaces a estas secciones para respaldar capacidades, soporte y capacitación en tu propuesta.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
