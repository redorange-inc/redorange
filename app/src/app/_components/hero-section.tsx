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
              Tecnología que impulsa operación, ventas y continuidad
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Soluciones integrales para tu empresa: IT, digital e infraestructura</h1>

            <p className="text-base text-muted-foreground md:text-lg">
              En Red Orange diseñamos, implementamos y mantenemos soluciones tecnológicas que mejoran procesos, optimizan costos y aseguran disponibilidad: desde software y cloud hasta web, hosting, hardware y
              conectividad.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="font-heading">
                <Link href="/#services">Ver servicios</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading">
                <Link href="/#contact">Hablar con un asesor</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Consultoría</span>
              <span className="rounded-full bg-muted px-3 py-1">Implementación</span>
              <span className="rounded-full bg-muted px-3 py-1">Soporte y mantenimiento</span>
              <span className="rounded-full bg-muted px-3 py-1">Capacitación</span>
            </div>
          </div>

          <div className="relative">
            <div className="glass-effect rounded-2xl border border-border/60 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">Un solo partner, tres líneas</h2>
              <p className="mt-2 text-sm text-muted-foreground">Selecciona el servicio que necesitas y te proponemos un alcance claro con entregables, soporte y continuidad.</p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">IT & Software</p>
                  <p className="text-sm text-muted-foreground">Sistemas, cloud, redes, base de datos y help desk.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Web & Digital</p>
                  <p className="text-sm text-muted-foreground">Web institucional, hosting, dominios y correo.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="font-heading text-sm font-bold">Infra & Telecom</p>
                  <p className="text-sm text-muted-foreground">Hardware, conectividad, redes e instalación.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Desliza con tu scroll para ver cada línea.</p>
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
