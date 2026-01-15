'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Laptop, Globe, Network, PhoneCall, ChevronLeft, ChevronRight } from 'lucide-react';

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

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ServicesScroller: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const isAnimatingRef = useRef(false);
  const hasEnteredRef = useRef(false);
  const exitingRef = useRef<'up' | 'down' | null>(null);

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
        gradient: 'from-blue-500/10 to-cyan-500/5',
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
        gradient: 'from-purple-500/10 to-pink-500/5',
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
        gradient: 'from-orange-500/10 to-red-500/5',
      },
    ],
    [],
  );

  const slideCount = slides.length;

  const animateToSlide = useCallback(
    (targetSlide: number, onComplete?: () => void) => {
      if (isAnimatingRef.current) return;

      const next = clamp(targetSlide, 0, slideCount - 1);
      if (next === currentSlide) {
        onComplete?.();
        return;
      }

      isAnimatingRef.current = true;
      setCurrentSlide(next);

      const duration = prefersReducedMotion() ? 0 : 500;
      setTimeout(() => {
        isAnimatingRef.current = false;
        onComplete?.();
      }, duration);
    },
    [slideCount, currentSlide],
  );

  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      exitingRef.current = 'down';
      setIsLocked(false);
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToHero = useCallback(() => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
      exitingRef.current = 'up';
      setIsLocked(false);
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!hasEnteredRef.current || exitingRef.current) {
            hasEnteredRef.current = true;
            exitingRef.current = null;
            setIsLocked(true);
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (!entry.isIntersecting) {
          setIsLocked(false);
          if (entry.boundingClientRect.top > 0) {
            hasEnteredRef.current = false;
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLocked) return;

    const THRESHOLD = 80;
    let accumulatedDelta = 0;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked || isAnimatingRef.current) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      if (currentSlide === 0 && delta < 0) {
        accumulatedDelta += delta;
        if (Math.abs(accumulatedDelta) >= THRESHOLD) {
          accumulatedDelta = 0;
          scrollToHero();
          return;
        }
        e.preventDefault();
        return;
      }

      if (currentSlide === slideCount - 1 && delta > 0) {
        accumulatedDelta += delta;
        if (accumulatedDelta >= THRESHOLD) {
          accumulatedDelta = 0;
          scrollToAbout();
          return;
        }
        e.preventDefault();
        return;
      }

      e.preventDefault();
      accumulatedDelta += delta;

      if (resetTimeout) clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      if (Math.abs(accumulatedDelta) >= THRESHOLD) {
        const direction = accumulatedDelta > 0 ? 1 : -1;
        accumulatedDelta = 0;
        animateToSlide(currentSlide + direction);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [isLocked, currentSlide, slideCount, animateToSlide, scrollToHero, scrollToAbout]);

  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;

      const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown'];
      const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];

      if (nextKeys.includes(e.key)) {
        e.preventDefault();
        if (currentSlide < slideCount - 1) {
          animateToSlide(currentSlide + 1);
        } else {
          scrollToAbout();
        }
      }

      if (prevKeys.includes(e.key)) {
        e.preventDefault();
        if (currentSlide > 0) {
          animateToSlide(currentSlide - 1);
        } else {
          scrollToHero();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, currentSlide, slideCount, animateToSlide, scrollToHero, scrollToAbout]);

  useEffect(() => {
    if (!isLocked) return;

    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;

      const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      const threshold = 50;

      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        if (currentSlide < slideCount - 1) {
          animateToSlide(currentSlide + 1);
        } else {
          scrollToAbout();
        }
      } else {
        if (currentSlide > 0) {
          animateToSlide(currentSlide - 1);
        } else {
          scrollToHero();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLocked, currentSlide, slideCount, animateToSlide, scrollToHero, scrollToAbout]);

  return (
    <section id="services" ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-linear-to-br transition-all duration-700 ${slides[currentSlide].gradient}`} />

      {/* Track de slides - contenido centrado */}
      <div ref={containerRef} className="flex h-full transition-transform duration-500 ease-out will-change-transform" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
        {slides.map((slide, idx) => {
          const isActive = currentSlide === idx;
          const Icon = slide.icon;

          return (
            <div key={slide.id} id={slide.id} className="relative h-screen w-screen shrink-0">
              {/* Contenedor centrado vertical y horizontalmente */}
              <div className="flex h-full w-full items-center justify-center px-6 md:px-10">
                <div className="mx-auto w-full max-w-7xl">
                  <div
                    className={`grid w-full items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-14 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  >
                    {/* Columna izquierda - Información */}
                    <div className="space-y-4">
                      <Badge variant="secondary" className="w-fit font-heading">
                        {slide.badge}
                      </Badge>

                      <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">{slide.title}</h2>
                        <p className="text-base text-muted-foreground md:text-lg">{slide.subtitle}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {slide.bullets.map((bullet) => (
                          <span key={bullet} className="rounded-full bg-muted/70 px-2.5 py-1 text-xs text-muted-foreground">
                            {bullet}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                        <Button asChild size="lg" className="font-heading group">
                          <a href={slide.href} target="_blank" rel="noreferrer">
                            {slide.cta}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </a>
                        </Button>

                        <Button asChild size="lg" variant="outline" className="font-heading">
                          <Link href="/#contact">
                            Contactarnos
                            <PhoneCall className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground/50">
                        <span className="font-mono">{slide.href}</span>
                      </p>
                    </div>

                    {/* Columna derecha - Panel de entregables */}
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-md md:p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 md:h-12 md:w-12">
                          <Icon className="h-5 w-5 text-primary md:h-6 md:w-6" />
                        </div>
                        <div>
                          <p className="font-heading text-xs font-semibold text-muted-foreground md:text-sm">Qué incluye</p>
                          <p className="text-sm font-bold md:text-base">Alcance típico y entregables</p>
                        </div>
                      </div>

                      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {slide.deliverables.map((d, i) => (
                          <AccordionItem key={d.title} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-heading text-xs md:text-sm py-2.5">{d.title}</AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground md:text-sm pb-2">{d.content}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      <div className="mt-4 rounded-xl bg-muted/50 p-3">
                        <p className="font-heading text-xs font-semibold md:text-sm">Modalidad</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">Servicio por proyecto, mensual o por demanda, según necesidad y SLA.</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild variant="secondary" size="sm" className="font-heading text-xs">
                          <a href={slide.href} target="_blank" rel="noreferrer">
                            Ver más
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </a>
                        </Button>

                        <Button asChild variant="ghost" size="sm" className="font-heading text-xs">
                          <Link href="/#contact">
                            Solicitar cotización
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores de navegación - posición fija en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 md:pb-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => !isAnimatingRef.current && animateToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-primary shadow-md' : 'w-2 bg-foreground/20 hover:bg-foreground/30'}`}
                aria-label={`Ir a ${s.title}`}
              />
            ))}
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentSlide > 0) {
                  animateToSlide(currentSlide - 1);
                } else {
                  scrollToHero();
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="min-w-12 text-center text-xs text-muted-foreground">
              {currentSlide + 1} / {slideCount}
            </span>

            <button
              type="button"
              onClick={() => {
                if (currentSlide < slideCount - 1) {
                  animateToSlide(currentSlide + 1);
                } else {
                  scrollToAbout();
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
