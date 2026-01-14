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
        gradient: 'from-[#fa661d]/10 via-transparent to-[#fcaf34]/5',
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
        gradient: 'from-[#6bc039]/10 via-transparent to-[#7dd34f]/5',
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
        gradient: 'from-[#fc9129]/10 via-transparent to-[#ff7733]/5',
      },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const now = Date.now();
      lastScrollTimeRef.current = now;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = el.offsetHeight;
      const range = Math.max(1, sectionHeight - viewportH);
      const y = window.scrollY - sectionTop;

      setProgress(clamp01(y / range));

      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);

      snapTimerRef.current = window.setTimeout(() => {
        if (Date.now() - lastScrollTimeRef.current < 420) return;

        const stillRect = el.getBoundingClientRect();
        if (stillRect.top > 0 || stillRect.bottom < viewportH) return;

        const count = slides.length;
        const maxIndex = Math.max(1, count - 1);
        const currentY = window.scrollY - sectionTop;
        const currentProgress = clamp01(currentY / range);
        const targetIndex = Math.round(currentProgress * maxIndex);
        const targetProgress = targetIndex / maxIndex;
        const distance = Math.abs(currentProgress - targetProgress);

        if (distance > 0.25) return;

        const targetY = sectionTop + targetProgress * range;

        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }, 480);
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
    <section id="services" ref={sectionRef} className="relative no-scrollbar" style={{ height: `${slideCount * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden no-scrollbar scroll-snap-y-mandatory" style={{ scrollSnapType: 'y mandatory' }}>
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-1200"
          style={{
            background: `linear-gradient(135deg, ${slides[currentIndex]?.gradient || 'from-primary/5 via-transparent to-secondary/5'})`,
          }}
        />

        <div className="pointer-events-none absolute inset-0 opacity-60 bg-pattern" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground/80">Líneas de servicio</p>
              <p className="text-xs text-muted-foreground/70">Desliza para explorar</p>
            </div>

            <div className="flex items-center gap-3">
              {slides.map((s, idx) => {
                const active = currentIndex === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      const el = sectionRef.current;
                      if (!el) return;
                      const targetProgress = idx / (slideCount - 1);
                      const targetY = el.offsetTop + targetProgress * (el.offsetHeight - window.innerHeight);
                      window.scrollTo({ top: targetY, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
                    }}
                    className={`
                      group h-3.5 w-3.5 rounded-full transition-all duration-400
                      ${active ? 'bg-primary scale-125 shadow-[0_0_12px_4px_rgba(250,102,29,0.4)] ring-2 ring-primary/40' : 'bg-border/50 hover:bg-border/80 scale-100 hover:scale-110'}
                    `}
                    aria-label={`Ir a ${s.title}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex h-full no-scrollbar"
          style={{
            width: trackWidth,
            transform: `translateX(${translateXPercent}%)`,
            transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0.0, 1.0)',
            willChange: 'transform',
          }}
        >
          {slides.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentIndex === idx;

            return (
              <div key={s.id} id={s.id} className="h-screen scroll-snap-start shrink-0" style={{ width: '100vw' }}>
                <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
                  <div className={`grid w-full items-center gap-10 md:grid-cols-2 md:gap-16 transition-all duration-700 ease-out ${isActive ? 'animate-fade-in' : 'opacity-40 scale-95 blur-sm'}`}>
                    <div className="space-y-6">
                      <Badge variant="secondary" className={`font-heading ${isActive ? 'animate-fade-in-up animate-delay-100' : ''}`}>
                        {s.badge}
                      </Badge>

                      <div className="space-y-3">
                        <h2 className={`text-4xl font-extrabold tracking-tight md:text-6xl ${isActive ? 'animate-slide-in-left animate-duration-700' : ''}`}>{s.title}</h2>
                        <p className={`text-base md:text-xl text-muted-foreground ${isActive ? 'animate-fade-in-up animate-delay-200' : ''}`}>{s.subtitle}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {s.bullets.map((b, i) => (
                          <span key={b} className={`rounded-full bg-muted/70 px-3 py-1 text-xs text-muted-foreground ${isActive ? `animate-fade-in-up animate-delay-[${300 + i * 80}ms]` : ''}`}>
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="font-heading transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,102,29,0.35)] hover:ring-2 hover:ring-primary/30">
                          <a href={s.href} target="_blank" rel="noreferrer">
                            {s.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>

                        <Button asChild size="lg" variant="outline" className="font-heading transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-muted/50">
                          <Link href="/#contact">
                            Contactarnos
                            <PhoneCall className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground/70">
                        Enlace: <span className="font-mono">{s.href}</span>
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl border border-border/60 bg-background/50 p-6 shadow-md backdrop-blur-md transition-all duration-700 hover:shadow-xl hover:border-primary/30 ${
                        isActive ? 'animate-zoom-in animate-duration-800' : ''
                      }`}
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-muted/80 transition-transform duration-500 ${isActive ? 'animate-bounce animate-duration-1000' : ''}`}>
                          <Icon className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="font-heading text-sm font-bold text-muted-foreground">Qué incluye</p>
                          <p className="text-lg font-extrabold">Alcance típico y entregables</p>
                        </div>
                      </div>

                      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {s.deliverables.map((d, i) => (
                          <AccordionItem key={d.title} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-heading">{d.title}</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">{d.content}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      <div className="mt-6 rounded-xl bg-muted/40 p-4">
                        <p className="font-heading text-sm font-bold text-foreground">Modalidad</p>
                        <p className="mt-1 text-sm text-muted-foreground">Servicio por proyecto, mensual o por demanda, según necesidad y SLA.</p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Button asChild variant="secondary" className="font-heading transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-secondary/90">
                          <a href={s.href} target="_blank" rel="noreferrer">
                            Ver más
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>

                        <Button asChild variant="ghost" className="font-heading transition-all duration-300 hover:scale-105 hover:bg-muted/60">
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
