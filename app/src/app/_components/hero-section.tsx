'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, ShieldCheck, Layers, Cpu, Globe, Network, Sparkles } from 'lucide-react';

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const HeroSection: FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const glowLeftRef = useRef<HTMLDivElement | null>(null);
  const glowRightRef = useRef<HTMLDivElement | null>(null);
  const glowBottomRef = useRef<HTMLDivElement | null>(null);
  const chipRowRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (prefersReducedMotion()) return;

    //  intro sequence
    const badgeNode = hero.querySelectorAll('[data-hero="badge"]');
    const titleNodes = hero.querySelectorAll('[data-hero="title"]');
    const subtitleNodes = hero.querySelectorAll('[data-hero="subtitle"]');
    const ctaNodes = hero.querySelectorAll('[data-hero="cta"]');
    const panelNodes = hero.querySelectorAll('[data-hero="panel"]');
    const chipNodes = hero.querySelectorAll('[data-hero="chip"]');
    const lineNodes = hero.querySelectorAll('[data-hero="line"]');
    const statNodes = statsRef.current?.querySelectorAll('[data-stat]') ?? [];

    animate(badgeNode, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 650,
      easing: 'easeOutExpo',
      delay: 60,
    });

    animate(titleNodes, {
      translateY: [16, 0],
      opacity: [0, 1],
      duration: 900,
      easing: 'easeOutExpo',
      delay: (el, i) => 140 + i * 110,
    });

    animate(subtitleNodes, {
      translateY: [12, 0],
      opacity: [0, 1],
      duration: 720,
      easing: 'easeOutExpo',
      delay: 320,
    });

    animate(ctaNodes, {
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 650,
      easing: 'easeOutExpo',
      delay: (el, i) => 460 + i * 110,
    });

    animate(chipNodes, {
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 560,
      easing: 'easeOutExpo',
      delay: (el, i) => 620 + i * 70,
    });

    animate(panelNodes, {
      translateY: [16, 0],
      opacity: [0, 1],
      duration: 820,
      easing: 'easeOutExpo',
      delay: 420,
    });

    animate(lineNodes, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 650,
      easing: 'easeOutExpo',
      delay: (el, i) => 560 + i * 90,
    });

    if (statNodes.length) {
      animate(statNodes, {
        translateY: [10, 0],
        opacity: [0, 1],
        duration: 650,
        easing: 'easeOutExpo',
        delay: (el, i) => 720 + i * 120,
      });
    }

    //  subtle ambient motion
    const float = (el: HTMLDivElement | null, dx: number, dy: number, duration: number) => {
      if (!el) return;
      animate(el, {
        translateX: [0, dx],
        translateY: [0, dy],
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration,
        loop: true,
      });
    };

    float(glowLeftRef.current, -12, 10, 5400);
    float(glowRightRef.current, 12, -10, 5200);
    float(glowBottomRef.current, 8, 12, 5600);

    if (chipRowRef.current) {
      animate(chipRowRef.current, {
        opacity: [0, 1],
        duration: 850,
        easing: 'easeOutQuad',
        delay: 280,
      });
    }
  }, []);

  return (
    //  navbar is fixed in layout, so we remove top empty space by reducing padding and keeping min height
    <section id="home" ref={heroRef} className={['relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden', 'scroll-mt-28'].join(' ')}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-pattern" />

        <div ref={glowLeftRef} className="absolute -left-44 top-[-120px] h-[520px] w-[520px] rounded-full bg-primary/12 blur-3xl animate-in fade-in duration-700" />
        <div ref={glowRightRef} className="absolute -right-44 top-[-40px] h-[560px] w-[560px] rounded-full bg-secondary/10 blur-3xl animate-in fade-in duration-700 delay-150" />
        <div ref={glowBottomRef} className="absolute bottom-[-220px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl animate-in fade-in duration-700 delay-300" />

        <div className="absolute inset-0 bg-linear-to-b from-background/35 via-transparent to-background/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6 text-center lg:text-left">
            <Badge
              variant="secondary"
              className={[
                'inline-flex items-center gap-2',
                'border border-border/60 bg-background/60',
                'backdrop-blur font-heading text-xs',
                'opacity-0',
                'animate-in fade-in slide-in-from-top-2 duration-700',
              ].join(' ')}
              data-hero="badge"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Tecnología para operación, crecimiento y continuidad
            </Badge>

            <div className="space-y-3">
              <h1 className={['text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl', 'opacity-0 animate-in fade-in slide-in-from-bottom-3 duration-700'].join(' ')} data-hero="title">
                Soluciones integrales para <span className="text-gradient">IT, digital</span> e <span className="text-gradient">infraestructura</span>
              </h1>

              <p
                className={['mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:mx-0', 'opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150'].join(' ')}
                data-hero="subtitle"
              >
                Diseñamos, implementamos y mantenemos soluciones tecnológicas que mejoran procesos y aseguran disponibilidad: software y cloud, web y hosting, hardware y conectividad.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <div className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200" data-hero="cta">
                <Button asChild size="lg" className="font-heading group">
                  <Link href="/#services">
                    Ver líneas
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300" data-hero="cta">
                <Button asChild size="lg" variant="outline" className="font-heading">
                  <Link href="/#contact">Hablar con un asesor</Link>
                </Button>
              </div>
            </div>

            <div ref={chipRowRef} className="flex flex-wrap justify-center gap-2 pt-2 lg:justify-start">
              {['Consultoría', 'Implementación', 'Soporte', 'Mantenimiento'].map((tag, i) => (
                <span
                  key={tag}
                  data-hero="chip"
                  className={[
                    'opacity-0',
                    'rounded-full border border-border/60',
                    'bg-background/60 px-3 py-1.5 text-xs',
                    'text-muted-foreground backdrop-blur',
                    'animate-in fade-in slide-in-from-bottom-1 duration-700',
                  ].join(' ')}
                  style={{ animationDelay: `${260 + i * 90}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700 delay-500" data-hero="subtitle">
              <Link href="/#services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label="Ir a líneas">
                Ver servicios
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </Link>
            </div>
          </div>

          <div className="relative opacity-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-200" data-hero="panel">
            <div className="rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm backdrop-blur md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-heading text-sm font-extrabold">Tres líneas, una sola experiencia</p>
                  <p className="text-xs text-muted-foreground">Recorre cada línea en pantalla completa y elige la que necesitas.</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Layers className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  { title: 'IT & Technology', desc: 'Software, cloud, soporte y continuidad.', icon: Cpu, tone: 'bg-primary/10 text-primary', ring: 'hover:border-primary/30' },
                  { title: 'Digital & Web', desc: 'Web, hosting, dominios y correo.', icon: Globe, tone: 'bg-secondary/10 text-secondary', ring: 'hover:border-secondary/30' },
                  { title: 'Infra & Telecom', desc: 'Equipos, conectividad e instalación.', icon: Network, tone: 'bg-accent/10 text-accent', ring: 'hover:border-accent/30' },
                ].map(({ title, desc, icon: Icon, tone, ring }) => (
                  <div
                    key={title}
                    data-hero="line"
                    className={['group rounded-2xl border border-border/70 bg-background/60 p-4', 'transition-all hover:-translate-y-0.5 hover:shadow-sm', ring, 'opacity-0'].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-heading text-sm font-bold">{title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <div className={['flex h-10 w-10 items-center justify-center rounded-xl', tone].join(' ')}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Entregables y soporte incluidos
                      </span>
                      <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div ref={statsRef} className="mt-6 grid grid-cols-3 gap-3">
                <div data-stat className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-center opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700" style={{ animationDelay: '420ms' }}>
                  <p className="font-heading text-xs font-bold">Respuesta</p>
                  <p className="mt-1 text-xs text-muted-foreground">Rápida</p>
                </div>
                <div data-stat className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-center opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700" style={{ animationDelay: '520ms' }}>
                  <p className="font-heading text-xs font-bold">Entrega</p>
                  <p className="mt-1 text-xs text-muted-foreground">Por SLA</p>
                </div>
                <div data-stat className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-center opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700" style={{ animationDelay: '620ms' }}>
                  <p className="font-heading text-xs font-bold">Soporte</p>
                  <p className="mt-1 text-xs text-muted-foreground">Continuo</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Empieza por las líneas</p>
                <Button asChild size="sm" className="font-heading group">
                  <Link href="/#services">
                    Explorar
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-6 -top-6 hidden rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur lg:block animate-in fade-in zoom-in-95 duration-700 delay-500">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wide">RED ORANGE</p>
              <p className="mt-1 text-sm font-extrabold">Soluciones</p>
              <p className="text-xs text-muted-foreground">IT · Digital · Infra</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
