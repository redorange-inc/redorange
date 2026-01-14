'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
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

export const ServicesScroller: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isAnimatingRef = useRef(false);

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

  const slideCount = slides.length;

  const animateToSlide = (targetSlide: number) => {
    if (!trackRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const targetX = -targetSlide * 100;

    animate(trackRef.current, {
      translateX: `${targetX}vw`,
      duration: 900,
      easing: 'easeOutExpo',
      complete: () => {
        isAnimatingRef.current = false;
        setCurrentSlide(targetSlide);
      },
    });
  };

  useEffect(() => {
    let accumulatedDelta = 0;
    let rafPending = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const THRESHOLD = 55; // Ajusta según sensibilidad deseada (40–80)
    const DEBOUNCE = 90; // ms para resetear acumulado

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isSectionActive = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;

      if (!isSectionActive) return;

      // Permitir salir de la sección en los extremos
      const atTop = currentSlide === 0 && e.deltaY < 0;
      const atBottom = currentSlide === slideCount - 1 && e.deltaY > 0;

      if (atTop || atBottom) {
        return; // deja que el navegador maneje el scroll normal
      }

      e.preventDefault();

      accumulatedDelta += e.deltaY;

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;

          if (Math.abs(accumulatedDelta) >= THRESHOLD && !isAnimatingRef.current) {
            if (accumulatedDelta > 0 && currentSlide < slideCount - 1) {
              animateToSlide(currentSlide + 1);
            } else if (accumulatedDelta < 0 && currentSlide > 0) {
              animateToSlide(currentSlide - 1);
            }
            accumulatedDelta = 0;
          }
        });
      }

      // Reset acumulado si pasa tiempo sin rueda
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        accumulatedDelta = 0;
      }, DEBOUNCE);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentSlide, slideCount]);

  return (
    <section id="services" ref={sectionRef} className="relative min-h-screen">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-1200"
          style={{
            background: `linear-gradient(135deg, ${slides[currentSlide]?.gradient || 'from-gray-500/5 via-transparent to-gray-500/5'})`,
          }}
        />

        <div className="absolute left-0 right-0 top-6 z-20 pointer-events-auto">
          <div className="mx-auto flex max-w-7xl justify-center gap-3 px-6">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => !isAnimatingRef.current && animateToSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-10 bg-primary shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Ir a ${s.title}`}
              />
            ))}
          </div>
        </div>

        <div ref={trackRef} className="flex h-full will-change-transform" style={{ width: `${slideCount * 100}vw` }}>
          {slides.map((slide, idx) => {
            const isActive = currentSlide === idx;
            const Icon = slide.icon;

            return (
              <div key={slide.id} className="h-screen shrink-0" style={{ width: '100vw' }}>
                <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
                  <div className={`grid w-full gap-10 md:grid-cols-2 md:gap-16 transition-all duration-800 ${isActive ? 'opacity-100 scale-100' : 'opacity-35 scale-95 pointer-events-none'}`}>
                    <div className="space-y-6">
                      <Badge variant="secondary" className="font-heading">
                        {slide.badge}
                      </Badge>

                      <div className="space-y-3">
                        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">{slide.title}</h2>
                        <p className="text-lg md:text-xl text-muted-foreground">{slide.subtitle}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {slide.bullets.map((bullet) => (
                          <span key={bullet} className="rounded-full bg-muted/70 px-3 py-1 text-xs text-muted-foreground">
                            {bullet}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="font-heading">
                          <a href={slide.href} target="_blank" rel="noreferrer">
                            {slide.cta}
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

                      <p className="text-xs text-muted-foreground/70">
                        Enlace: <span className="font-mono">{slide.href}</span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-md">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-heading text-sm font-semibold text-muted-foreground">Qué incluye</p>
                          <p className="text-lg font-bold">Alcance típico y entregables</p>
                        </div>
                      </div>

                      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {slide.deliverables.map((d, i) => (
                          <AccordionItem key={d.title} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-heading text-base">{d.title}</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">{d.content}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      <div className="mt-6 rounded-xl bg-muted/50 p-4">
                        <p className="font-heading text-sm font-semibold">Modalidad</p>
                        <p className="mt-1 text-sm text-muted-foreground">Servicio por proyecto, mensual o por demanda, según necesidad y SLA.</p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button asChild variant="secondary" className="font-heading">
                          <a href={slide.href} target="_blank" rel="noreferrer">
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
