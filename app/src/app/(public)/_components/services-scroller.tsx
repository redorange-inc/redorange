'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Cpu, Globe, Network, ChevronLeft, ChevronRight, CheckCircle2, Pause, Play } from 'lucide-react';
import { fn_get_services, type ServiceSlide, type ServiceId } from '@/actions/fn-services';
import { getThemeClasses } from '@/helpers/theme-helpers';

const AUTOPLAY_INTERVAL = 4000;

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICONS: Record<ServiceSlide['id'], FC<{ className?: string }>> = {
  'ti-solutions': Cpu,
  'equipment-marketing': Network,
  'telecom-services': Globe,
};

export const ServicesScroller: FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [slides, setSlides] = useState<ServiceSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isAnimatingRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    fn_get_services()
      .then((data) => {
        if (!mounted) return;
        setSlides(data);
        setCurrentSlide(0);
      })
      .catch(() => {
        if (!mounted) return;
        setSlides([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const slideCount = slides.length;

  const animateToSlide = useCallback(
    (targetSlide: number) => {
      if (isAnimatingRef.current) return;
      if (slideCount === 0) return;

      const next = ((targetSlide % slideCount) + slideCount) % slideCount;
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

  const nextSlide = useCallback(() => {
    animateToSlide(currentSlide + 1);
  }, [currentSlide, animateToSlide]);

  const prevSlide = useCallback(() => {
    animateToSlide(currentSlide - 1);
  }, [currentSlide, animateToSlide]);

  useEffect(() => {
    if (slideCount === 0) return;
    if (!isPlaying || isHovered) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    autoplayRef.current = setInterval(() => {
      if (!isAnimatingRef.current) {
        nextSlide();
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isPlaying, isHovered, slideCount, nextSlide]);

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev);
  };

  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  if (slides.length === 0) {
    return (
      <section id="services" className="relative w-full py-12 sm:py-16 md:py-20">
        <div className="mx-auto flex max-w-xl items-center justify-center px-4 sm:px-6">
          <div className="w-full rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur">
            <p className="font-heading text-sm sm:text-base font-extrabold">Cargando servicios...</p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Preparando las líneas de negocio.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTheme = getThemeClasses(slides[currentSlide].colorTheme);

  return (
    <section id="services" className="relative w-full py-10 sm:py-12 md:py-16 overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={`absolute inset-0 transition-all duration-1000 ${currentTheme.gradient}`} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mb-4 sm:mb-6 text-center">
          <Badge variant="secondary" className="font-heading mb-2 text-xs">
            Nuestras Líneas
          </Badge>
          <h2 className="text-xl sm:text-2xl font-extrabold md:text-3xl">Servicios Integrales</h2>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-background/80 backdrop-blur-sm"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={containerRef} className="flex transition-transform duration-700 ease-out will-change-transform" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, idx) => {
              const isActive = currentSlide === idx;
              const Icon = ICONS[slide.id];
              const theme = getThemeClasses(slide.colorTheme);
              const detailHref = `/services/${slide.id}` satisfies `/services/${ServiceId}`;

              return (
                <div key={slide.id} className="w-full shrink-0 p-4 sm:p-6 md:p-8">
                  <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
                      <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                        <Badge variant="secondary" className="w-fit font-heading text-xs">
                          <Icon className={`mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 ${theme.text}`} />
                          {slide.badge}
                        </Badge>

                        <div className="space-y-1.5 sm:space-y-2">
                          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight md:text-2xl lg:text-3xl leading-tight">{slide.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground md:text-base line-clamp-3 sm:line-clamp-none">{slide.subtitle}</p>
                        </div>

                        <ul className="space-y-1 sm:space-y-1.5 max-h-24 sm:max-h-none overflow-y-auto sm:overflow-visible">
                          {slide.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-muted-foreground">
                              <CheckCircle2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 shrink-0 ${theme.text}`} />
                              <span className="line-clamp-2 sm:line-clamp-none">{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                          <Button asChild size="default" className="font-heading group text-xs sm:text-sm h-9 sm:h-10">
                            <a href={slide.href} target="_blank" rel="noreferrer">
                              {slide.cta}
                              <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                          </Button>

                          <Button asChild size="default" variant="secondary" className="font-heading text-xs sm:text-sm h-9 sm:h-10">
                            <Link href={detailHref}>
                              Detalle
                              <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
                        <div className={`relative transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                          <div className={`absolute inset-0 blur-3xl opacity-30 ${theme.gradient}`} />

                          <div className="relative">
                            <Image
                              src={slide.image}
                              alt={slide.title}
                              width={400}
                              height={400}
                              className={`w-full max-w-[280px] h-auto object-contain drop-shadow-2xl transition-transform duration-700 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}
                              priority={idx === 0}
                            />
                          </div>

                          <div className="absolute -bottom-4 -right-4 h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${theme.text}`} />
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3">
                        <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-background/80 p-3 sm:p-4 shadow-sm backdrop-blur-md">
                          <div className="mb-2 sm:mb-3 flex items-center gap-2">
                            <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${theme.bg}`}>
                              <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${theme.text}`} />
                            </div>
                            <div>
                              <p className="font-heading text-[10px] sm:text-xs font-semibold text-muted-foreground">Qué incluye</p>
                              <p className="text-[10px] sm:text-xs font-bold">Alcance y entregables</p>
                            </div>
                          </div>

                          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                            {slide.deliverables.map((d, i) => (
                              <AccordionItem key={d.title} value={`item-${i}`} className="border-border/50">
                                <AccordionTrigger className="text-left font-heading text-[11px] sm:text-xs py-1.5 sm:py-2 hover:no-underline">{d.title}</AccordionTrigger>
                                <AccordionContent className="text-[10px] sm:text-xs text-muted-foreground pb-1.5 sm:pb-2">{d.content}</AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>

                          <div className="mt-2 sm:mt-3 rounded-lg bg-muted/50 p-2 sm:p-2.5">
                            <p className="font-heading text-[10px] sm:text-xs font-semibold">Modalidad</p>
                            <p className="mt-0.5 text-[9px] sm:text-[11px] text-muted-foreground leading-relaxed">Por proyecto, mensual o demanda según SLA.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden mt-4 flex justify-center">
                      <Image src={slide.image} alt={slide.title} width={200} height={200} className="w-full max-w-[140px] sm:max-w-[160px] h-auto object-contain opacity-80" priority={idx === 0} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 sm:gap-3 px-4 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {slides.map((s, idx) => {
                  const SlideIcon = ICONS[s.id];
                  const shortLabel = idx === 0 ? 'TI' : idx === 1 ? 'Equipos' : 'Telecom';
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => !isAnimatingRef.current && animateToSlide(idx)}
                      className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 transition-all duration-500 ${
                        currentSlide === idx ? 'bg-primary text-primary-foreground shadow-md' : 'bg-foreground/10 text-muted-foreground hover:bg-foreground/20'
                      }`}
                      aria-label={`Ir a ${s.title}`}
                    >
                      <SlideIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className={`text-[10px] sm:text-xs font-heading transition-all duration-300 ${currentSlide === idx ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                        {currentSlide === idx && shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground active:scale-95"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleAutoplay}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground active:scale-95"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                </button>

                <span className="min-w-8 sm:min-w-10 text-center text-[10px] sm:text-xs text-muted-foreground">
                  {currentSlide + 1} / {slideCount}
                </span>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground active:scale-95"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="flex gap-1">
                {slides.map((_, idx) => (
                  <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-5 sm:w-6 bg-primary' : 'w-1 sm:w-1.5 bg-foreground/20'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
