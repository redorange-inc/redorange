'use client';

import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Target, Shield, Rocket } from 'lucide-react';

export const AboutSection: FC = () => {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 min-h-screen scroll-mt-28">
      {/*  section header */}
      <div className="mb-10 space-y-3">
        <Badge variant="secondary" className="w-fit font-heading">
          Nosotros
        </Badge>
        <h2 className="text-3xl font-extrabold md:text-4xl">Red Orange E.I.R.L.</h2>
        <p className="max-w-3xl text-muted-foreground md:text-lg">
          Somos un equipo orientado a resolver necesidades reales con soluciones tecnológicas integrales: desde el diseño y la implementación hasta el soporte y la continuidad. Trabajamos con un enfoque
          práctico, medible y alineado a objetivos.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/60 p-6 shadow-sm backdrop-blur md:p-8">
        <Tabs defaultValue="clarity" className="w-full">
          <TabsList className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            <TabsTrigger value="clarity" className="font-heading">
              Claridad en alcance
            </TabsTrigger>
            <TabsTrigger value="execution" className="font-heading">
              Ejecución y soporte
            </TabsTrigger>
            <TabsTrigger value="scale" className="font-heading">
              Escalabilidad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clarity" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <p className="font-heading text-lg font-extrabold">Objetivos y entregables</p>
                </div>
                <p className="text-sm text-muted-foreground">Definimos alcance, criterios de aceptación y entregables para asegurar resultados medibles y evitar ambigüedades.</p>
              </div>

              <ul className="space-y-3">
                {['Levantamiento de requerimientos y diagnóstico', 'Plan de trabajo con cronograma y responsables', 'Documentación y trazabilidad de cambios', 'Criterios de aceptación por entrega'].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <p className="font-heading text-lg font-extrabold">Soporte y continuidad</p>
                </div>
                <p className="text-sm text-muted-foreground">Implementamos con buenas prácticas y acompañamos con soporte, mantenimiento y mejora continua.</p>
              </div>

              <ul className="space-y-3">
                {['Mesa de ayuda y atención por niveles', 'Mantenimiento preventivo y correctivo', 'Monitoreo, backups y seguridad', 'Gestión de incidencias y mejoras'].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="scale" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  <p className="font-heading text-lg font-extrabold">Preparados para crecer</p>
                </div>
                <p className="text-sm text-muted-foreground">Diseñamos pensando en crecimiento: rendimiento, seguridad, monitoreo y continuidad operativa.</p>
              </div>

              <ul className="space-y-3">
                {['Arquitecturas escalables y mantenibles', 'Estandarización y documentación', 'Automatización y optimización', 'Mejora continua por iteraciones'].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
