'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ChevronDown, ShieldCheck, Layers, Cpu, Globe, Network, Sparkles } from 'lucide-react';

import { getThemeClasses, type ColorTheme } from '@/helpers/theme-helpers';

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HeroSkeleton: FC = () => (
  <section className="relative flex min-h-screen items-center overflow-hidden scroll-mt-0 pt-16">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-30" />
      <div className="absolute inset-0 bg-linear-to-b from-background/35 via-transparent to-background" />
    </div>

    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
      <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Skeleton className="h-6 w-64 sm:w-80 rounded-full" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-8 sm:h-10 md:h-12 lg:h-14 w-full max-w-xl mx-auto lg:mx-0" />
            <Skeleton className="h-8 sm:h-10 md:h-12 lg:h-14 w-3/4 max-w-md mx-auto lg:mx-0" />
            <div className="pt-2">
              <Skeleton className="h-4 sm:h-5 w-full max-w-2xl mx-auto lg:mx-0" />
              <Skeleton className="h-4 sm:h-5 w-5/6 max-w-xl mx-auto lg:mx-0 mt-2" />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Skeleton className="h-10 sm:h-11 w-full sm:w-32 rounded-lg" />
            <Skeleton className="h-10 sm:h-11 w-full sm:w-40 rounded-lg" />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-1 lg:justify-start">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 sm:h-8 w-20 sm:w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl sm:rounded-3xl border border-border/40 bg-background/40 p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 sm:h-6 w-48 sm:w-56" />
                <Skeleton className="h-3 sm:h-4 w-full max-w-xs" />
              </div>
              <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shrink-0" />
            </div>

            <div className="mt-4 sm:mt-5 grid gap-2 sm:gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl sm:rounded-2xl border border-border/40 bg-background/30 p-3 sm:p-3.5">
                  <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 sm:h-5 w-3/4" />
                      <Skeleton className="h-3 sm:h-4 w-full" />
                    </div>
                    <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl shrink-0" />
                  </div>
                  <div className="mt-2 sm:mt-2.5">
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl sm:rounded-2xl border border-border/40 bg-muted/20 p-2 sm:p-2.5">
                  <Skeleton className="h-3 sm:h-4 w-16 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto mt-1" />
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/40 bg-muted/20 p-3 sm:p-3.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 sm:h-9 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const HeroSection: FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const glowLeftRef = useRef<HTMLDivElement | null>(null);
  const glowRightRef = useRef<HTMLDivElement | null>(null);
  const glowBottomRef = useRef<HTMLDivElement | null>(null);
  const chipRowRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const hero = heroRef.current;
    if (!hero) return;
    if (prefersReducedMotion()) return;

    const badgeNode = hero.querySelectorAll('[data-hero="badge"]');
    const titleNodes = hero.querySelectorAll('[data-hero="title"]');
    const subtitleNodes = hero.querySelectorAll('[data-hero="subtitle"]');
    const ctaNodes = hero.querySelectorAll('[data-hero="cta"]');
    const panelNodes = hero.querySelectorAll('[data-hero="panel"]');
    const chipNodes = hero.querySelectorAll('[data-hero="chip"]');
    const lineNodes = hero.querySelectorAll('[data-hero="line"]');
    const statNodes = statsRef.current?.querySelectorAll('[data-stat]') ?? [];

    animate(badgeNode, { opacity: [0, 1], translateY: [10, 0], duration: 650, easing: 'easeOutExpo', delay: 60 });
    animate(titleNodes, { translateY: [16, 0], opacity: [0, 1], duration: 900, easing: 'easeOutExpo', delay: (el, i) => 140 + i * 110 });
    animate(subtitleNodes, { translateY: [12, 0], opacity: [0, 1], duration: 720, easing: 'easeOutExpo', delay: 320 });
    animate(ctaNodes, { translateY: [10, 0], opacity: [0, 1], duration: 650, easing: 'easeOutExpo', delay: (el, i) => 460 + i * 110 });
    animate(chipNodes, { translateY: [10, 0], opacity: [0, 1], duration: 560, easing: 'easeOutExpo', delay: (el, i) => 620 + i * 70 });
    animate(panelNodes, { translateY: [16, 0], opacity: [0, 1], duration: 820, easing: 'easeOutExpo', delay: 420 });
    animate(lineNodes, { opacity: [0, 1], translateY: [10, 0], duration: 650, easing: 'easeOutExpo', delay: (el, i) => 560 + i * 90 });

    if (statNodes.length) {
      animate(statNodes, { translateY: [10, 0], opacity: [0, 1], duration: 650, easing: 'easeOutExpo', delay: (el, i) => 720 + i * 120 });
    }

    const float = (el: HTMLDivElement | null, dx: number, dy: number, duration: number) => {
      if (!el) return;
      animate(el, { translateX: [0, dx], translateY: [0, dy], direction: 'alternate', easing: 'easeInOutSine', duration, loop: true });
    };

    float(glowLeftRef.current, -12, 10, 5400);
    float(glowRightRef.current, 12, -10, 5200);
    float(glowBottomRef.current, 8, 12, 5600);

    if (chipRowRef.current) {
      animate(chipRowRef.current, { opacity: [0, 1], duration: 850, easing: 'easeOutQuad', delay: 280 });
    }
  }, [isLoaded]);

  const serviceLines: Array<{
    title: string;
    desc: string;
    icon: typeof Cpu;
    colorTheme: ColorTheme;
  }> = [
    {
      title: 'Tecnología y Soluciones Informáticas (TI)',
      desc: 'Consultoría, desarrollo, soporte, redes y bases de datos.',
      icon: Cpu,
      colorTheme: 'tech',
    },
    {
      title: 'Comercialización e Importación de Equipos',
      desc: 'Equipos, periféricos, cotizaciones, instalación y mantenimiento.',
      icon: Network,
      colorTheme: 'infra',
    },
    {
      title: 'Telecomunicaciones y Servicios Digitales',
      desc: 'Internet, hosting, cloud, dominios, web y soluciones energéticas.',
      icon: Globe,
      colorTheme: 'digital',
    },
  ];

  if (!isLoaded) {
    return <HeroSkeleton />;
  }

  return (
    <section id="home" ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden scroll-mt-0 pt-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-50 sm:opacity-100" />

        <div
          ref={glowLeftRef}
          className="absolute -left-32 sm:-left-44 top-[-80px] sm:top-[-120px] h-[300px] sm:h-[520px] w-[300px] sm:w-[520px] rounded-full bg-(--tech-gradient-from) blur-3xl opacity-60 sm:opacity-100 animate-in fade-in duration-700"
        />
        <div
          ref={glowRightRef}
          className="absolute -right-32 sm:-right-44 top-[-20px] sm:top-[-40px] h-[320px] sm:h-[560px] w-[320px] sm:w-[560px] rounded-full bg-(--infra-gradient-from) blur-3xl opacity-60 sm:opacity-100 animate-in fade-in duration-700 delay-150"
        />
        <div
          ref={glowBottomRef}
          className="absolute bottom-[-120px] sm:bottom-[-220px] left-1/2 h-[320px] sm:h-[560px] w-[320px] sm:w-[560px] -translate-x-1/2 rounded-full bg-(--digital-gradient-from) blur-3xl opacity-60 sm:opacity-100 animate-in fade-in duration-700 delay-300"
        />

        <div className="absolute inset-0 bg-linear-to-b from-background/35 via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 sm:gap-2 border border-border/60 bg-background/60 backdrop-blur font-heading text-[10px] sm:text-xs opacity-0 animate-in fade-in slide-in-from-top-2 duration-700"
              data-hero="badge"
            >
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
              <span className="max-w-[200px] sm:max-w-none truncate sm:whitespace-normal">Tecnología para operación, crecimiento y continuidad</span>
            </Badge>

            <div className="space-y-2 sm:space-y-3">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight opacity-0 animate-in fade-in slide-in-from-bottom-3 duration-700"
                data-hero="title"
              >
                Soluciones integrales en <span className="text-tech">TI</span>, <span className="text-infra">equipamiento</span> y <span className="text-digital">conectividad</span>
              </h1>

              <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground lg:mx-0 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150" data-hero="subtitle">
                Integramos consultoría, desarrollo, soporte, comercialización de equipos y servicios digitales para impulsar tus procesos con disponibilidad, seguridad y escalabilidad.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <div className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200" data-hero="cta">
                <Button asChild size="lg" className="font-heading group w-full sm:w-auto">
                  <Link href="/#services">
                    Ver líneas
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300" data-hero="cta">
                <Button asChild size="lg" variant="outline" className="font-heading w-full sm:w-auto">
                  <Link href="/#contact">Hablar con un asesor</Link>
                </Button>
              </div>
            </div>

            <div ref={chipRowRef} className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-1 lg:justify-start">
              {['Consultoría', 'Implementación', 'Soporte', 'Mantenimiento'].map((tag, i) => (
                <span
                  key={tag}
                  data-hero="chip"
                  className="opacity-0 rounded-full border border-border/60 bg-background/60 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-muted-foreground backdrop-blur animate-in fade-in slide-in-from-bottom-1 duration-700"
                  style={{ animationDelay: `${260 + i * 90}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="hidden sm:block pt-2 opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700 delay-500" data-hero="subtitle">
              <Link href="/#services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label="Ir a líneas">
                Ver servicios
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </Link>
            </div>
          </div>

          <div className="relative opacity-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-200" data-hero="panel">
            <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-background/70 p-4 sm:p-5 md:p-6 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                  <p className="font-heading text-sm sm:text-base font-extrabold truncate">Tres líneas, una sola experiencia</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2">Recorre cada línea en pantalla completa y elige la que necesitas.</p>
                </div>

                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>

              <div className="mt-4 sm:mt-5 grid gap-2 sm:gap-2.5">
                {serviceLines.map(({ title, desc, icon: Icon, colorTheme }) => {
                  const theme = getThemeClasses(colorTheme);

                  return (
                    <div
                      key={title}
                      data-hero="line"
                      className={[
                        'group rounded-xl sm:rounded-2xl border border-border/70 bg-background/60 p-3 sm:p-3.5',
                        'transition-all hover:-translate-y-0.5 hover:shadow-sm',
                        `hover:${theme.border}`,
                        'opacity-0',
                      ].join(' ')}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-xs sm:text-sm font-bold line-clamp-2 sm:line-clamp-1">{title}</p>
                          <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">{desc}</p>
                        </div>
                        <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${theme.bg} ${theme.text}`}>
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-2.5 flex items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 sm:gap-2">
                          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="hidden xs:inline">Entregables y soporte incluidos</span>
                          <span className="xs:hidden">Soporte incluido</span>
                        </span>
                        <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div ref={statsRef} className="mt-4 sm:mt-5 grid grid-cols-3 gap-1.5 sm:gap-2.5">
                {[
                  { title: 'Respuesta', subtitle: 'Rápida' },
                  { title: 'Entrega', subtitle: 'Por SLA' },
                  { title: 'Soporte', subtitle: 'Continuo' },
                ].map((stat, index) => (
                  <div
                    key={stat.title}
                    data-stat
                    className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/40 p-2 sm:p-2.5 text-center opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700"
                    style={{ animationDelay: `${420 + index * 100}ms` }}
                  >
                    <p className="font-heading text-[10px] sm:text-xs font-bold">{stat.title}</p>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 p-3 sm:p-3.5">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Empieza por las líneas</p>
                <Button asChild size="sm" className="font-heading group h-8 sm:h-9 text-xs sm:text-sm">
                  <Link href="/#services">
                    Explorar
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-4 -top-4 hidden rounded-xl sm:rounded-2xl border border-border/60 bg-background/70 p-3 sm:p-4 shadow-sm backdrop-blur xl:block animate-in fade-in zoom-in-95 duration-700 delay-500">
              <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-wide">RED ORANGE</p>
              <p className="mt-1 text-xs sm:text-sm font-extrabold">Soluciones</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">TI · Equipos · Telecom</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-in fade-in duration-700 delay-700">
        <Link href="/#services" className="flex flex-col items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-[10px] sm:text-xs">Scroll</span>
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
        </Link>
      </div>
    </section>
  );
};
