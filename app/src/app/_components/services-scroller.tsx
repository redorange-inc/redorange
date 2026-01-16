'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Laptop, Globe, Network, PhoneCall, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

type ServiceSlide = {
  id: 'it-technology' | 'digital-web' | 'infra-telecom';
  title: string;
  subtitle: string;
  badge: string;
  bullets: string[];
  href: string;
  cta: string;
  icon: FC<{ className?: string }>;
  image: string;
  deliverables: { title: string; content: string }[];
  gradient: string;
  accentColor: string;
};

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));
const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ServicesScroller: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const isAnimatingRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          'Administración de servidores y bases de datos',
          'Cloud, backups, monitoreo y seguridad',
          'Mesa de ayuda, soporte y mantenimiento',
        ],
        href: 'https://tech.redorange.net.pe',
        cta: 'Ir al servicio',
        icon: Laptop,
        image: '/img/tech.png',
        deliverables: [
          { title: 'Levantamiento y diagnóstico', content: 'Requerimientos, alcance, riesgos y plan de trabajo con entregables.' },
          { title: 'Implementación y configuración', content: 'Despliegue, parametrización, hardening, backups y monitoreo.' },
          { title: 'Soporte y mantenimiento', content: 'Mesa de ayuda, correctivos, preventivos y mejora continua según SLA.' },
        ],
        gradient: 'from-cyan-500/15 via-blue-500/10 to-transparent',
        accentColor: 'text-cyan-600 dark:text-cyan-400',
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
        image: '/img/digital.png',
        deliverables: [
          { title: 'Diseño y contenido', content: 'Arquitectura de información, UI, copy base y estructura por objetivos.' },
          { title: 'Desarrollo y publicación', content: 'Implementación, optimización, SEO base, deployment y analítica.' },
          { title: 'Operación y soporte', content: 'Mantenimiento, seguridad, backups y mejoras por iteraciones.' },
        ],
        gradient: 'from-orange-500/15 via-amber-500/10 to-transparent',
        accentColor: 'text-orange-600 dark:text-orange-400',
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
        image: '/img/infra.png',
        deliverables: [
          { title: 'Suministro y provisión', content: 'Equipamiento, accesorios, periféricos y componentes según requerimiento.' },
          { title: 'Instalación y puesta en marcha', content: 'Redes, cableado, pruebas, etiquetado y documentación técnica.' },
          { title: 'Soporte y postventa', content: 'Mantenimiento, diagnósticos, reposiciones y continuidad del servicio.' },
        ],
        gradient: 'from-rose-500/15 via-orange-500/10 to-transparent',
        accentColor: 'text-rose-600 dark:text-rose-400',
      },
    ],
    [],
  );

  const slideCount = slides.length;

  const animateToSlide = useCallback(
    (targetSlide: number) => {
      if (isAnimatingRef.current) return;

      const next = clamp(targetSlide, 0, slideCount - 1);
      if (next === currentSlide) return;

      isAnimatingRef.current = true;
      setCurrentSlide(next);

      const duration = prefersReducedMotion() ? 0 : 700;
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, duration);
    },
    [slideCount, currentSlide],
  );

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setIsLocked(false);
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
          if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
          lockTimeoutRef.current = setTimeout(() => {
            setIsLocked(true);
          }, 100);
        } else if (entry.intersectionRatio < 0.5) {
          if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
          setIsLocked(false);
        }
      },
      { threshold: [0, 0.5, 0.95, 1], rootMargin: '0px' },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, []);

  // Manejar wheel
  useEffect(() => {
    if (!isLocked) return;

    const THRESHOLD = 100;
    let accumulatedDelta = 0;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isFullyVisible = rect.top >= -10 && rect.top <= 10;

      if (!isFullyVisible) {
        setIsLocked(false);
        return;
      }

      e.preventDefault();

      if (isAnimatingRef.current) return;

      const delta = e.deltaY;
      accumulatedDelta += delta * 0.6;

      if (resetTimeout) clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      if (currentSlide === 0 && accumulatedDelta < -THRESHOLD) {
        accumulatedDelta = 0;
        scrollToSection('home');
        return;
      }

      if (currentSlide === slideCount - 1 && accumulatedDelta > THRESHOLD) {
        accumulatedDelta = 0;
        scrollToSection('about');
        return;
      }

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
  }, [isLocked, currentSlide, slideCount, animateToSlide, scrollToSection]);

  // Manejar teclas
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;

      const nextKeys = ['ArrowRight', 'ArrowDown'];
      const prevKeys = ['ArrowLeft', 'ArrowUp'];

      if (nextKeys.includes(e.key)) {
        e.preventDefault();
        if (currentSlide < slideCount - 1) animateToSlide(currentSlide + 1);
        else scrollToSection('about');
      }

      if (prevKeys.includes(e.key)) {
        e.preventDefault();
        if (currentSlide > 0) animateToSlide(currentSlide - 1);
        else scrollToSection('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, currentSlide, slideCount, animateToSlide, scrollToSection]);

  // Touch support
  useEffect(() => {
    if (!isLocked) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;
      const threshold = 50;

      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        if (currentSlide < slideCount - 1) animateToSlide(currentSlide + 1);
        else scrollToSection('about');
      } else {
        if (currentSlide > 0) animateToSlide(currentSlide - 1);
        else scrollToSection('home');
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLocked, currentSlide, slideCount, animateToSlide, scrollToSection]);

  return (
    <section id="services" ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
      <div className={`absolute inset-0 bg-linear-to-br transition-all duration-1000 ${slides[currentSlide].gradient}`} />

      <div ref={containerRef} className="flex h-full transition-transform duration-700 ease-out will-change-transform" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
        {slides.map((slide, idx) => {
          const isActive = currentSlide === idx;
          const Icon = slide.icon;

          return (
            <div key={slide.id} id={slide.id} className="relative h-screen w-screen shrink-0">
              <div className="flex h-full w-full items-center justify-center px-4 md:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-7xl">
                  <div className={`grid w-full items-center gap-6 lg:grid-cols-12 lg:gap-8 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="lg:col-span-5 space-y-4">
                      <Badge variant="secondary" className="w-fit font-heading">
                        <Icon className={`mr-1.5 h-3.5 w-3.5 ${slide.accentColor}`} />
                        {slide.badge}
                      </Badge>

                      <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">{slide.title}</h2>
                        <p className="text-sm text-muted-foreground md:text-base">{slide.subtitle}</p>
                      </div>

                      <ul className="space-y-1.5">
                        {slide.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                            <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${slide.accentColor}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                        <Button asChild size="default" className="font-heading group">
                          <a href={slide.href} target="_blank" rel="noreferrer">
                            {slide.cta}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        </Button>

                        <Button asChild size="default" variant="outline" className="font-heading">
                          <Link href="/#contact">
                            Contactarnos
                            <PhoneCall className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
                      <div className={`relative transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                        <div className={`absolute inset-0 blur-3xl opacity-30 bg-linear-to-br ${slide.gradient}`} />

                        <div className="relative">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            width={400}
                            height={400}
                            className={`w-full max-w-[320px] h-auto object-contain drop-shadow-2xl transition-transform duration-700 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}
                            priority={idx === 0}
                          />
                        </div>

                        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                          <Icon className={`h-8 w-8 ${slide.accentColor}`} />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur-md">
                        <div className="mb-3 flex items-center gap-2">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10`}>
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-heading text-xs font-semibold text-muted-foreground">Qué incluye</p>
                            <p className="text-xs font-bold">Alcance y entregables</p>
                          </div>
                        </div>

                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                          {slide.deliverables.map((d, i) => (
                            <AccordionItem key={d.title} value={`item-${i}`} className="border-border/50">
                              <AccordionTrigger className="text-left font-heading text-xs py-2 hover:no-underline">{d.title}</AccordionTrigger>
                              <AccordionContent className="text-xs text-muted-foreground pb-2">{d.content}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>

                        <div className="mt-3 rounded-lg bg-muted/50 p-2.5">
                          <p className="font-heading text-xs font-semibold">Modalidad</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">Por proyecto, mensual o demanda según SLA.</p>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button asChild variant="secondary" size="sm" className="font-heading text-xs flex-1">
                            <a href={slide.href} target="_blank" rel="noreferrer">
                              Ver más
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </a>
                          </Button>

                          <Button asChild variant="ghost" size="sm" className="font-heading text-xs">
                            <Link href="/#contact">Cotizar</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:hidden mt-4 flex justify-center">
                    <Image src={slide.image} alt={slide.title} width={200} height={200} className="w-full max-w-[180px] h-auto object-contain opacity-80" priority={idx === 0} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 pb-4 md:pb-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6">
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => {
              const SlideIcon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => !isAnimatingRef.current && animateToSlide(idx)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-500 ${
                    currentSlide === idx ? 'bg-primary text-primary-foreground shadow-md' : 'bg-foreground/10 text-muted-foreground hover:bg-foreground/20'
                  }`}
                  aria-label={`Ir a ${s.title}`}
                >
                  <SlideIcon className="h-3.5 w-3.5" />
                  <span className={`text-xs font-heading transition-all duration-300 ${currentSlide === idx ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    {currentSlide === idx && (idx === 0 ? 'IT' : idx === 1 ? 'Digital' : 'Infra')}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isAnimatingRef.current) return;
                if (currentSlide > 0) animateToSlide(currentSlide - 1);
                else scrollToSection('home');
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="min-w-10 text-center text-xs text-muted-foreground">
              {currentSlide + 1} / {slideCount}
            </span>

            <button
              type="button"
              onClick={() => {
                if (isAnimatingRef.current) return;
                if (currentSlide < slideCount - 1) animateToSlide(currentSlide + 1);
                else scrollToSection('about');
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
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
