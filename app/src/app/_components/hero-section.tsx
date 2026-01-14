import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const HeroSection: FC = () => {
  return (
    <section id="home" className="relative overflow-hidden scroll-mt-28">
      {/*  background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-pattern" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="secondary" className="font-heading">
              Tecnología para operación, crecimiento y continuidad
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Soluciones integrales en IT, servicios digitales e infraestructura</h1>

            <p className="text-base text-muted-foreground md:text-lg">
              En Red Orange diseñamos, implementamos y mantenemos soluciones tecnológicas que mejoran procesos y aseguran disponibilidad: software y cloud, web y hosting, hardware y conectividad.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="font-heading">
                <Link href="/#services">Ver lineas</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading">
                <Link href="/#contact">Hablar con un asesor</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Consultoría</span>
              <span className="rounded-full bg-muted px-3 py-1">Implementación</span>
              <span className="rounded-full bg-muted px-3 py-1">Soporte</span>
              <span className="rounded-full bg-muted px-3 py-1">Mantenimiento</span>
            </div>
          </div>

          <div className="relative">
            <div className="glass-effect rounded-2xl border border-border/60 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">Tres lineas, una sola experiencia</h2>
              <p className="mt-2 text-sm text-muted-foreground">Desliza con tu scroll para recorrer cada linea en pantalla completa y elegir la que necesitas.</p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">IT & Technology</p>
                  <p className="text-sm text-muted-foreground">Software, cloud, redes, soporte y continuidad.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Digital & Web</p>
                  <p className="text-sm text-muted-foreground">Web institucional, hosting, dominios y correo.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Infra & Telecom</p>
                  <p className="text-sm text-muted-foreground">Hardware, conectividad, redes e instalación.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Empieza por las lineas</p>
                <Button asChild size="sm" className="font-heading">
                  <Link href="/#services">Explorar</Link>
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
