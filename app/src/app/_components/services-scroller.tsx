'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Laptop, Globe, Network } from 'lucide-react';

type ServiceSlide = {
  id: 'it-technology' | 'digital-web' | 'infra-telecom';
  title: string;
  subtitle: string;
  badge: string;
  points: string[];
  href: string;
  cta: string;
  icon: FC<{ className?: string }>;
};

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

export const ServicesScroller: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  //  service configuration and destinations
  const slides = useMemo<ServiceSlide[]>(
    () => [
      {
        id: 'it-technology',
        title: 'IT & Technology Solutions',
        subtitle: 'Software, cloud, soporte y continuidad',
        badge: 'Para operaciones críticas',
        points: [
          'Desarrollo de software y sistemas a medida',
          'Consultoría TI y transformación digital',
          'Administración de servidores, redes y bases de datos',
          'Cloud, backups, monitoreo y seguridad',
          'Mesa de ayuda, soporte y mantenimiento',
        ],
        href: 'https://tech.redorange.net.pe',
        cta: 'Ir al servicio',
        icon: Laptop,
      },
      {
        id: 'digital-web',
        title: 'Digital & Web Services',
        subtitle: 'Web institucional, hosting, correo y e-commerce',
        badge: 'Para presencia y ventas',
        points: ['Diseño y desarrollo web institucional', 'Plataformas digitales y e-commerce', 'Hosting, dominios y certificados', 'Correo corporativo y seguridad web', 'Intranet, extranet y soporte'],
        href: 'https://digital.redorange.net.pe',
        cta: 'Conocer más',
        icon: Globe,
      },
      {
        id: 'infra-telecom',
        title: 'Hardware, Telecom & Infrastructure',
        subtitle: 'Equipos, conectividad e instalación',
        badge: 'Para infraestructura estable',
        points: [
          'Venta y distribución de equipos y periféricos',
          'Telecomunicaciones y conectividad',
          'Instalación de redes y cableado estructurado',
          'Mantenimiento, soporte y postventa',
          'Infraestructura para crecimiento y disponibilidad',
        ],
        href: 'https://infra.redorange.net.pe',
        cta: 'Ver soluciones',
        icon: Network,
      },
    ],
    [],
  );

  //  vertical scroll mapped to horizontal translate
  useEffect(() => {
    const onScroll = (): void => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;

        //  section top in document coordinates
        const sectionTop = window.scrollY + rect.top;
        const sectionHeight = el.offsetHeight;

        //  scroll range where sticky is active (height - viewport)
        const range = Math.max(1, sectionHeight - viewportH);
        const y = window.scrollY - sectionTop;

        setProgress(clamp01(y / range));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const translateXvw = -(progress * (slides.length - 1) * 100);

  return (
    <section id="services" ref={sectionRef} className="relative" style={{ height: `${slides.length * 100}vh` }}>
      {/*  sticky viewport that turns y scroll into x movement */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/*  top label */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-muted-foreground">Servicios</p>
              <p className="text-xs text-muted-foreground">Desliza con tu scroll para cambiar de línea</p>
            </div>

            {/*  progress indicator */}
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => {
                const active = Math.round(progress * (slides.length - 1)) === idx;
                return <span key={s.id} className={['h-2 w-2 rounded-full transition-all', active ? 'bg-primary' : 'bg-border'].join(' ')} aria-hidden="true" />;
              })}
            </div>
          </div>
        </div>

        {/*  horizontal track */}
        <div className="flex h-full w-[300vw] transition-transform duration-75 will-change-transform" style={{ transform: `translateX(${translateXvw}vw)` }}>
          {slides.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} id={s.id} className="flex h-screen w-screen items-center justify-center px-4">
                {/*  one slide per full screen */}
                <div className="mx-auto w-full max-w-6xl">
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    <div className="space-y-5">
                      <Badge variant="secondary" className="font-heading">
                        {s.badge}
                      </Badge>

                      <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">{s.title}</h2>

                      <p className="text-base text-muted-foreground md:text-lg">{s.subtitle}</p>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="font-heading">
                          <a href={s.href} target="_blank" rel="noreferrer">
                            {s.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>

                        <Button asChild size="lg" variant="outline" className="font-heading">
                          <Link href="/#contact">
                            Solicitar cotización
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Enlace: <span className="font-mono">{s.href}</span>
                      </div>
                    </div>

                    <Card className="border-border/70">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                            <Icon className="h-6 w-6 text-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-extrabold">¿Qué incluye?</CardTitle>
                            <p className="text-sm text-muted-foreground">Alcance típico y entregables</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                          {s.points.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>

                        <div className="rounded-xl bg-muted p-4">
                          <p className="font-heading text-sm font-bold text-foreground">Modalidad</p>
                          <p className="mt-1 text-sm text-muted-foreground">Servicio por proyecto, mensual o por demanda, según necesidad y SLA.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/*  background accents */}
        <div className="pointer-events-none absolute -right-10 top-24 h-44 w-44 rounded-full bg-primary/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 bottom-24 h-44 w-44 rounded-full bg-accent/15 blur-2xl" />
      </div>
    </section>
  );
};
