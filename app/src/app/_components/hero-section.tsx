'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, ShieldCheck, Layers, Cpu } from 'lucide-react';

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

    //  respect reduced motion
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    //  intro sequence
    const titleNodes = hero.querySelectorAll('[data-hero="title"]');
    const subtitleNodes = hero.querySelectorAll('[data-hero="subtitle"]');
    const ctaNodes = hero.querySelectorAll('[data-hero="cta"]');
    const panelNodes = hero.querySelectorAll('[data-hero="panel"]');
    const chipNodes = hero.querySelectorAll('[data-hero="chip"]');
    const statNodes = statsRef.current?.querySelectorAll('[data-stat]') ?? [];

    //  titles
    animate(titleNodes, {
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 850,
      easing: 'easeOutExpo',
      delay: (el, i) => i * 120,
    });

    //  subtitle
    animate(subtitleNodes, {
      translateY: [14, 0],
      opacity: [0, 1],
      duration: 650,
      easing: 'easeOutExpo',
      delay: 240,
    });

    //  ctas
    animate(ctaNodes, {
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutExpo',
      delay: (el, i) => 380 + i * 90,
    });

    //  panel
    animate(panelNodes, {
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 720,
      easing: 'easeOutExpo',
      delay: 320,
    });

    //  chips
    animate(chipNodes, {
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 520,
      easing: 'easeOutExpo',
      delay: (el, i) => 520 + i * 60,
    });

    //  stats
    if (statNodes.length) {
      animate(statNodes, {
        translateY: [10, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: (el, i) => 560 + i * 120,
      });
    }

    //  subtle ambient motion
    const float = (el: HTMLDivElement | null, dx: number, dy: number) => {
      if (!el) return;
      animate(el, {
        translateX: [0, dx],
        translateY: [0, dy],
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 5200,
        loop: true,
      });
    };

    float(glowLeftRef.current, -10, 12);
    float(glowRightRef.current, 12, -8);
    float(glowBottomRef.current, 8, 10);

    if (chipRowRef.current) {
      animate(chipRowRef.current, {
        opacity: [0, 1],
        duration: 850,
        easing: 'easeOutQuad',
        delay: 240,
      });
    }
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden scroll-mt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-pattern" />
        <div ref={glowLeftRef} className="absolute -left-44 top-[-60px] h-[520px] w-[520px] rounded-full bg-primary/12 blur-3xl" />
        <div ref={glowRightRef} className="absolute -right-44 top-[40px] h-[560px] w-[560px] rounded-full bg-secondary/10 blur-3xl" />
        <div ref={glowBottomRef} className="absolute bottom-[-180px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="secondary" className={['inline-flex items-center gap-2', 'border border-border/60 bg-background/60', 'backdrop-blur font-heading text-xs', 'opacity-0'].join(' ')} data-hero="title">
              <ShieldCheck className="h-3.5 w-3.5" />
              Tecnología para operación, crecimiento y continuidad
            </Badge>

            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl opacity-0" data-hero="title">
                Soluciones integrales para <span className="text-gradient">IT, digital</span> e <span className="text-gradient">infraestructura</span>
              </h1>

              <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:mx-0 opacity-0" data-hero="subtitle">
                Diseñamos, implementamos y mantenemos soluciones tecnológicas que mejoran procesos y aseguran disponibilidad: software y cloud, web y hosting, hardware y conectividad.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <div className="opacity-0" data-hero="cta">
                <Button asChild size="lg" className="font-heading group">
                  <Link href="/#services">
                    Ver líneas
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="opacity-0" data-hero="cta">
                <Button asChild size="lg" variant="outline" className="font-heading">
                  <Link href="/#contact">Hablar con un asesor</Link>
                </Button>
              </div>
            </div>

            <div ref={chipRowRef} className="flex flex-wrap justify-center gap-2 pt-2 lg:justify-start">
              {['Consultoría', 'Implementación', 'Soporte', 'Mantenimiento'].map((tag) => (
                <span key={tag} data-hero="chip" className={['opacity-0', 'rounded-full border border-border/60', 'bg-background/60 px-3 py-1.5 text-xs', 'text-muted-foreground backdrop-blur'].join(' ')}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 opacity-0" data-hero="subtitle">
              <Link href="/#services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label="Ir a líneas">
                Ver servicios
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </Link>
            </div>
          </div>

          <div className="relative opacity-0" data-hero="panel">
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
                <div className="group rounded-2xl border border-border/70 bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-sm font-bold">IT & Technology</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Software, cloud, soporte y continuidad.</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-border/70 bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-sm font-bold">Digital & Web</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Web, hosting, dominios y correo.</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                      <Layers className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-border/70 bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-sm font-bold">Infra & Telecom</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Equipos, conectividad e instalación.</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              <div ref={statsRef} className="mt-6 grid grid-cols-3 gap-3">
                <div data-stat className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-center opacity-0">
                  <p className="font-heading text-xs font-bold">Respuesta</p>
                  <p className="mt-1 text-xs text-muted-foreground">Rápida</p>
                </div>
                <div data-stat className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-center opacity-0">
                  <p className="font-heading text-xs font-bold">Entrega</p>
                  <p className="mt-1 text-xs text-muted-foreground">Por SLA</p>
                </div>
                <div data-stat className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-center opacity-0">
                  <p className="font-heading text-xs font-bold">Soporte</p>
                  <p className="mt-1 text-xs text-muted-foreground">Continuo</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Empieza por las líneas</p>
                <Button asChild size="sm" className="font-heading">
                  <Link href="/#services">
                    Explorar
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/*  side accent */}
            <div className="pointer-events-none absolute -right-6 -top-6 hidden rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur lg:block">
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
