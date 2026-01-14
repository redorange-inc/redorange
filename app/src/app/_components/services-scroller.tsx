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
  gradient: string;
};

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ServicesScroller: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const snapTimerRef = useRef<number | null>(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const [progress, setProgress] = useState(0);

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
        gradient: 'from-blue-500/10 via-transparent to-cyan-500/5',
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
        gradient: 'from-purple-500/10 via-transparent to-pink-500/5',
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
        gradient: 'from-orange-500/10 via-transparent to-red-500/5',
      },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = (): void => {
      const el = sectionRef.current;
      if (!el) return;

      const now = Date.now();
      lastScrollTimeRef.current = now;
      isUserScrollingRef.current = true;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = el.offsetHeight;

      const range = Math.max(1, sectionHeight - viewportH);
      const y = window.scrollY - sectionTop;

      const newProgress = clamp01(y / range);
      setProgress(newProgress);

      // Limpiar timer anterior
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);

      // Snap más suave y solo cuando el usuario deja de scrollear
      snapTimerRef.current = window.setTimeout(() => {
        const timeSinceScroll = Date.now() - lastScrollTimeRef.current;

        // Solo hacer snap si han pasado >400ms sin scroll
        if (timeSinceScroll < 400) return;

        const stillRect = el.getBoundingClientRect();
        const active = stillRect.top <= 0 && stillRect.bottom >= viewportH;
        if (!active) return;

        const count = slides.length;
        const maxIndex = Math.max(1, count - 1);
        const currentY = window.scrollY - sectionTop;
        const currentProgress = clamp01(currentY / range);

        // Encontrar el slide más cercano
        const targetIndex = Math.round(currentProgress * maxIndex);
        const targetProgress = targetIndex / maxIndex;

        // Solo hacer snap si estamos "cerca" del punto de snap (dentro del 20%)
        const distance = Math.abs(currentProgress - targetProgress);
        if (distance > 0.2) return;

        const targetY = sectionTop + targetProgress * range;

        isUserScrollingRef.current = false;

        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }, 450);
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
  const currentIndex = Math.round(progress * (slideCount - 1));

  return (
    <section id="services" ref={sectionRef} className="relative" style={{ height: `${slideCount * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background gradient que cambia según el slide */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-1000"
          style={{
            background: `linear-gradient(135deg, ${slides[currentIndex]?.gradient || 'from-primary/5 via-transparent to-secondary/5'})`,
          }}
        />

        {/* Subtle background */}
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-pattern" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        {/* Header con indicadores */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">Líneas de servicio</p>
              <p className="text-xs text-muted-foreground">Desliza para explorar</p>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((s, idx) => {
                const active = currentIndex === idx;
                return <span key={s.id} className={['h-2 rounded-full transition-all duration-300', active ? 'w-8 bg-primary' : 'w-2 bg-border'].join(' ')} aria-hidden="true" />;
              })}
            </div>
          </div>
        </div>

        {/* Horizontal track con transición más suave */}
        <div
          className="flex h-full"
          style={{
            width: trackWidth,
            transform: `translateX(${translateXPercent}%)`,
            // eslint-disable-next-line react-hooks/refs
            transition: isUserScrollingRef.current ? 'transform 120ms cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 180ms cubic-bezier(0.33, 1, 0.68, 1)',
            willChange: 'transform',
          }}
        >
          {slides.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentIndex === idx;

            return (
              <div key={s.id} id={s.id} className="h-screen" style={{ flex: '0 0 100vw' }}>
                <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
                  <div className={`grid w-full items-center gap-10 md:grid-cols-2 md:gap-16 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                    {/* Left column */}
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

                    {/* Right column - interactive */}
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
