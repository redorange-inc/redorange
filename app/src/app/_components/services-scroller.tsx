'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Laptop, Globe, Network, PhoneCall } from 'lucide-react';

type ServiceSlide = {
  id: 'it-technology' | 'digital-web' | 'infra-telecom';
  title: string;
  subtitle: string;
  badge: string;
  bullets: string[];
  href: string;
  cta: string;
  icon: FC<{ className?: string }>;
  deliverables: { title: string; content: string }[];
};

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ServicesScroller: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const snapTimerRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  //  service configuration and destinations
  const slides = useMemo<ServiceSlide[]>(
    () => [
      {
        id: 'it-technology',
        title: 'IT & Technology Solutions',
        subtitle: 'Software, cloud, soporte y continuidad',
        badge: 'Para operaciones críticas',
        bullets: [
          'Desarrollo de software y sistemas a medida',
          'Consultoría TI y automatización de procesos',
          'Administración de servidores, redes y bases de datos',
          'Cloud, backups, monitoreo y seguridad',
          'Mesa de ayuda, soporte y mantenimiento',
        ],
        href: 'https://tech.redorange.net.pe',
        cta: 'Ir al servicio',
        icon: Laptop,
        deliverables: [
          { title: 'Levantamiento y diagnóstico', content: 'Requerimientos, alcance, riesgos y plan de trabajo con entregables.' },
          { title: 'Implementación y configuración', content: 'Despliegue, parametrización, hardening, backups y monitoreo.' },
          { title: 'Soporte y mantenimiento', content: 'Mesa de ayuda, correctivos, preventivos y mejora continua según SLA.' },
        ],
      },
      {
        id: 'digital-web',
        title: 'Digital & Web Services',
        subtitle: 'Web, hosting, correo y soluciones para ventas',
        badge: 'Para presencia y crecimiento',
        bullets: [
          'Web institucional moderna y administrable',
          'Landing pages y campañas de conversión',
          'E-commerce y catálogos digitales',
          'Hosting, dominios, certificados y correos',
          'Seguridad web y soporte continuo',
        ],
        href: 'https://digital.redorange.net.pe',
        cta: 'Conocer más',
        icon: Globe,
        deliverables: [
          { title: 'Diseño y contenido', content: 'Arquitectura de información, UI, copy base y estructura por objetivos.' },
          { title: 'Desarrollo y publicación', content: 'Implementación, optimización, SEO base, deployment y analítica.' },
          { title: 'Operación y soporte', content: 'Mantenimiento, seguridad, backups y mejoras por iteraciones.' },
        ],
      },
      {
        id: 'infra-telecom',
        title: 'Hardware, Telecom & Infrastructure',
        subtitle: 'Equipos, conectividad e instalación',
        badge: 'Para infraestructura estable',
        bullets: [
          'Venta y distribución de equipos y periféricos',
          'Conectividad, enlaces y soluciones de telecom',
          'Instalación de redes y cableado estructurado',
          'Mantenimiento, soporte y postventa',
          'Infraestructura preparada para escalar',
        ],
        href: 'https://infra.redorange.net.pe',
        cta: 'Ver soluciones',
        icon: Network,
        deliverables: [
          { title: 'Suministro y provisión', content: 'Equipamiento, accesorios, periféricos y componentes según requerimiento.' },
          { title: 'Instalación y puesta en marcha', content: 'Redes, cableado, pruebas, etiquetado y documentación técnica.' },
          { title: 'Soporte y postventa', content: 'Mantenimiento, diagnósticos, reposiciones y continuidad del servicio.' },
        ],
      },
    ],
    [],
  );

  //  map y scroll to x progress inside this section
  useEffect(() => {
    const handleScroll = (): void => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      //  section top in document coordinates
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = el.offsetHeight;

      //  range where sticky is active
      const range = Math.max(1, sectionHeight - viewportH);
      const y = window.scrollY - sectionTop;

      setProgress(clamp01(y / range));

      //  snap between slides like pages
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(() => {
        //  only snap while section is active in viewport
        const stillRect = el.getBoundingClientRect();
        const active = stillRect.top <= 0 && stillRect.bottom >= viewportH;
        if (!active) return;

        const count = slides.length;
        const maxIndex = Math.max(1, count - 1);
        const index = Math.round(clamp01(y / range) * maxIndex);
        const targetProgress = index / maxIndex;
        const targetY = sectionTop + targetProgress * range;

        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });

        //  when finishing last slide, jump to about (avoid empty end)
        if (index === maxIndex) {
          const about = document.getElementById('about');
          if (about) {
            const aboutTop = window.scrollY + about.getBoundingClientRect().top - 88;
            window.scrollTo({
              top: aboutTop,
              behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            });
          }
        }
      }, 140);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
    };
  }, [slides.length]);

  const slideCount = slides.length;
  const trackWidth = `${slideCount * 100}vw`;
  const translateXPercent = -(progress * (slideCount - 1) * 100);

  return (
    <section id="services" ref={sectionRef} className="relative" style={{ height: `${slideCount * 100}vh` }}>
      {/*  sticky viewport that turns y scroll into x movement */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/*  subtle background */}
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-pattern" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        {/*  top header */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-muted-foreground">Lineas</p>
              <p className="text-xs text-muted-foreground">Scroll para avanzar como páginas</p>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((s, idx) => {
                const active = Math.round(progress * (slideCount - 1)) === idx;
                return <span key={s.id} className={['h-2 w-2 rounded-full transition-all', active ? 'bg-primary' : 'bg-border'].join(' ')} aria-hidden="true" />;
              })}
            </div>
          </div>
        </div>

        {/*  horizontal track */}
        <div
          className="flex h-full"
          style={{
            width: trackWidth,
            transform: `translateX(${translateXPercent}%)`,
            transition: 'transform 80ms linear',
            willChange: 'transform',
          }}
        >
          {slides.map((s) => {
            const Icon = s.icon;

            return (
              <div key={s.id} id={s.id} className="h-screen" style={{ flex: '0 0 100vw' }}>
                {/*  full screen layout */}
                <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
                  <div className="grid w-full items-center gap-10 md:grid-cols-2 md:gap-16">
                    {/*  left */}
                    <div className="space-y-6">
                      <Badge variant="secondary" className="font-heading">
                        {s.badge}
                      </Badge>

                      <div className="space-y-3">
                        <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">{s.title}</h2>
                        <p className="text-base text-muted-foreground md:text-xl">{s.subtitle}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {s.bullets.map((b) => (
                          <span key={b} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="font-heading">
                          <a href={s.href} target="_blank" rel="noreferrer">
                            {s.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>

                        <Button asChild size="lg" variant="outline" className="font-heading">
                          <Link href="/#contact">
                            Contactarnos
                            <PhoneCall className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Enlace: <span className="font-mono">{s.href}</span>
                      </p>
                    </div>

                    {/*  right interactive */}
                    <div className="rounded-2xl border border-border/70 bg-background/60 p-6 shadow-sm backdrop-blur">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                          <Icon className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="font-heading text-sm font-bold text-muted-foreground">Qué incluye</p>
                          <p className="text-lg font-extrabold">Alcance típico y entregables</p>
                        </div>
                      </div>

                      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {s.deliverables.map((d, idx) => (
                          <AccordionItem key={d.title} value={`item-${idx}`}>
                            <AccordionTrigger className="text-left font-heading">{d.title}</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">{d.content}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      <div className="mt-6 rounded-xl bg-muted p-4">
                        <p className="font-heading text-sm font-bold text-foreground">Modalidad</p>
                        <p className="mt-1 text-sm text-muted-foreground">Servicio por proyecto, mensual o por demanda, según necesidad y SLA.</p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Button asChild variant="secondary" className="font-heading">
                          <a href={s.href} target="_blank" rel="noreferrer">
                            Ver más
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>

                        <Button asChild variant="ghost" className="font-heading">
                          <Link href="/#contact">
                            Solicitar cotización
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
