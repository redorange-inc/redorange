import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/*  background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-pattern" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="secondary" className="font-heading">
              Servicios para sector público y privado (SIGA, SIAF, SEACE)
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Soluciones integrales en tecnología, servicios digitales e infraestructura</h1>

            <p className="text-base text-muted-foreground md:text-lg">
              En Red Orange E.I.R.L. brindamos consultoría, implementación, soporte, mantenimiento y capacitación para optimizar procesos, asegurar continuidad operativa y fortalecer capacidades
              institucionales.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="font-heading">
                <Link href="/#contact">Solicitar cotización</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading">
                <Link href="/#it-technology">Ver líneas de servicio</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Consultoría TI</span>
              <span className="rounded-full bg-muted px-3 py-1">Desarrollo de software</span>
              <span className="rounded-full bg-muted px-3 py-1">Web, hosting y correo</span>
              <span className="rounded-full bg-muted px-3 py-1">Hardware, telecom e internet</span>
            </div>
          </div>

          <div className="relative">
            <div className="glass-effect  rounded-2xl border border-border/60 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">Atención orientada a proyectos</h2>
              <p className="mt-2 text-sm text-muted-foreground">Preparamos documentación y alcance técnico alineado a requerimientos, TDR y criterios de evaluación.</p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Implementación y soporte</p>
                  <p className="text-sm text-muted-foreground">Mesa de ayuda, mantenimiento preventivo y correctivo, y continuidad operativa.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Seguridad y disponibilidad</p>
                  <p className="text-sm text-muted-foreground">Buenas prácticas para servidores, redes, backups, monitoreo y hardening.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Capacitación</p>
                  <p className="text-sm text-muted-foreground">Entrenamiento en SIGA, SIAF y SEACE, además de herramientas y procesos TI.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">¿Necesitas alcance técnico para tu proceso?</p>
                <Button asChild size="sm" className="font-heading">
                  <Link href="/#seace">Ver SEACE</Link>
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-accent/20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
