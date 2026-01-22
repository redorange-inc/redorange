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

const AUTOPLAY_INTERVAL = 2000;

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

  if (slides.length === 0) {
    return (
      <section id="services" className="relative w-full py-16 md:py-20">
        <div className="mx-auto flex max-w-xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur">
            <p className="font-heading text-base font-extrabold">Cargando servicios...</p>
            <p className="mt-1 text-sm text-muted-foreground">Preparando las líneas de negocio.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTheme = getThemeClasses(slides[currentSlide].colorTheme);

  return (
    <section id="services" className="relative w-full py-12 md:py-16 overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={`absolute inset-0 transition-all duration-1000 ${currentTheme.gradient}`} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 text-center">
          <Badge variant="secondary" className="font-heading mb-2">
            Nuestras Líneas
          </Badge>
          <h2 className="text-2xl font-extrabold md:text-3xl">Servicios Integrales</h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 backdrop-blur-sm">
          <div ref={containerRef} className="flex transition-transform duration-700 ease-out will-change-transform" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, idx) => {
              const isActive = currentSlide === idx;
              const Icon = ICONS[slide.id];
              const theme = getThemeClasses(slide.colorTheme);
              const detailHref = `/services/${slide.id}` satisfies `/services/${ServiceId}`;

              return (
                <div key={slide.id} className="w-full shrink-0 p-6 md:p-8">
                  <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                      <div className="lg:col-span-5 space-y-4">
                        <Badge variant="secondary" className="w-fit font-heading">
                          <Icon className={`mr-1.5 h-3.5 w-3.5 ${theme.text}`} />
                          {slide.badge}
                        </Badge>

                        <div className="space-y-2">
                          <h3 className="text-xl font-extrabold tracking-tight md:text-2xl lg:text-3xl">{slide.title}</h3>
                          <p className="text-sm text-muted-foreground md:text-base">{slide.subtitle}</p>
                        </div>

                        <ul className="space-y-1.5">
                          {slide.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                              <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${theme.text}`} />
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

                          <Button asChild size="default" variant="secondary" className="font-heading">
                            <Link href={detailHref}>
                              Detalle
                              <ArrowRight className="ml-2 h-4 w-4" />
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

                          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                            <Icon className={`h-6 w-6 ${theme.text}`} />
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur-md">
                          <div className="mb-3 flex items-center gap-2">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme.bg}`}>
                              <Icon className={`h-4 w-4 ${theme.text}`} />
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
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden mt-4 flex justify-center">
                      <Image src={slide.image} alt={slide.title} width={200} height={200} className="w-full max-w-[160px] h-auto object-contain opacity-80" priority={idx === 0} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-0 right-0 z-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6">
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => {
                  const SlideIcon = ICONS[s.id];
                  const shortLabel = idx === 0 ? 'TI' : idx === 1 ? 'Equipos' : 'Telecom';
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
                        {currentSlide === idx && shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleAutoplay}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </button>

                <span className="min-w-10 text-center text-xs text-muted-foreground">
                  {currentSlide + 1} / {slideCount}
                </span>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:bg-background hover:text-foreground"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-1">
                {slides.map((_, idx) => (
                  <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/20'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
