'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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

  // Animar a un slide específico
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

  // Scroll a la sección about
  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      exitingRef.current = 'down';
      setIsLocked(false);
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll al hero
  const scrollToHero = useCallback(() => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
      exitingRef.current = 'up';
      setIsLocked(false);
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Detectar entrada/salida de la sección
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Entrando a la sección
          if (!hasEnteredRef.current || exitingRef.current) {
            hasEnteredRef.current = true;
            exitingRef.current = null;
            setIsLocked(true);

            // Centrar la sección en viewport
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (!entry.isIntersecting) {
          // Saliendo de la sección
          setIsLocked(false);

          // Reset al volver desde arriba
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

  // Manejar wheel cuando está bloqueado
  useEffect(() => {
    if (!isLocked) return;

    const THRESHOLD = 80;
    let accumulatedDelta = 0;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Solo procesar si estamos bloqueados
      if (!isLocked || isAnimatingRef.current) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      // Intentando salir hacia arriba desde el primer slide
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

      // Intentando salir hacia abajo desde el último slide
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

      // Navegación normal entre slides
      e.preventDefault();
      accumulatedDelta += delta;

      // Reset del acumulador después de un tiempo
      if (resetTimeout) clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      // Cambiar slide cuando se alcanza el threshold
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

  // Soporte de teclado
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;

      const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown'];
      const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];

      if (nextKeys.includes(e.key)) {
        e.preventDefault();
        if (currentSlide < slideCount - 1) animateToSlide(currentSlide + 1);
        else scrollToAbout();
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

  // Soporte táctil
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

      // Usar el delta más grande
      const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      const threshold = 50;

      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        // Swipe hacia arriba/izquierda - siguiente
        if (currentSlide < slideCount - 1) animateToSlide(currentSlide + 1);
        else scrollToAbout();
      } else {
        // Swipe hacia abajo/derecha - anterior
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
      <div className={`absolute inset-0 bg-linear-to-br transition-all duration-700 ${slides[currentSlide].gradient}`} />

      <div className="absolute left-0 right-0 top-6 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => !isAnimatingRef.current && animateToSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-10 bg-primary shadow-md' : 'w-2.5 bg-foreground/15 hover:bg-foreground/25'}`}
              aria-label={`Ir a ${s.title}`}
            />
          ))}
        </div>

        <div className="mx-auto mt-2 flex max-w-7xl justify-center">
          <span className="text-xs text-muted-foreground/60">
            {currentSlide + 1} / {slideCount}
          </span>
        </div>
      </div>

      <div ref={containerRef} className="flex h-full transition-transform duration-500 ease-out will-change-transform" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
        {slides.map((slide, idx) => {
          const isActive = currentSlide === idx;
          const Icon = slide.icon;

          return (
            <div key={slide.id} id={slide.id} className="h-screen w-screen shrink-0">
              <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
                <div className={`grid w-full gap-8 md:grid-cols-2 md:gap-12 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {/* Columna izquierda - Información */}
                  <div className="space-y-5">
                    <Badge variant="secondary" className="font-heading">
                      {slide.badge}
                    </Badge>

                    <div className="space-y-3">
                      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">{slide.title}</h2>
                      <p className="text-base text-muted-foreground md:text-lg">{slide.subtitle}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {slide.bullets.map((bullet) => (
                        <span key={bullet} className="rounded-full bg-muted/70 px-3 py-1.5 text-xs text-muted-foreground">
                          {bullet}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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

                    <p className="text-xs text-muted-foreground/60">
                      <span className="font-mono">{slide.href}</span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/70 p-5 shadow-sm backdrop-blur-md md:p-6">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-semibold text-muted-foreground">Qué incluye</p>
                        <p className="text-base font-bold md:text-lg">Alcance típico y entregables</p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                      {slide.deliverables.map((d, i) => (
                        <AccordionItem key={d.title} value={`item-${i}`}>
                          <AccordionTrigger className="text-left font-heading text-sm md:text-base">{d.title}</AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground">{d.content}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <div className="mt-5 rounded-xl bg-muted/50 p-4">
                      <p className="font-heading text-sm font-semibold">Modalidad</p>
                      <p className="mt-1 text-sm text-muted-foreground">Servicio por proyecto, mensual o por demanda, según necesidad y SLA.</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild variant="secondary" size="sm" className="font-heading">
                        <a href={slide.href} target="_blank" rel="noreferrer">
                          Ver más
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>

                      <Button asChild variant="ghost" size="sm" className="font-heading">
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

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-6">
          <button
            type="button"
            onClick={() => {
              if (currentSlide > 0) {
                animateToSlide(currentSlide - 1);
              } else {
                scrollToHero();
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
            aria-label="Anterior"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>

          <span className="text-sm text-muted-foreground">Usa scroll o flechas para navegar</span>

          <button
            type="button"
            onClick={() => {
              if (currentSlide < slideCount - 1) {
                animateToSlide(currentSlide + 1);
              } else {
                scrollToAbout();
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
            aria-label="Siguiente"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
