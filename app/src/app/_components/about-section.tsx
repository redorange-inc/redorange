'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Shield,
  Rocket,
  ClipboardCheck,
  Calendar,
  FileText,
  CheckSquare,
  HeadphonesIcon,
  Wrench,
  Database,
  TrendingUp,
  BookOpen,
  Zap,
  RefreshCw,
  Users,
  Lightbulb,
  MessageSquareText,
  BadgeCheck,
  Timer,
} from 'lucide-react';

interface FeatureCard {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  iconColor: string;
  items: Array<{ icon: FC<{ className?: string }>; text: string }>;
}

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const AboutSection: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const features = useMemo<FeatureCard[]>(
    () => [
      {
        icon: Target,
        title: 'Claridad en alcance',
        description: 'Definimos objetivos, criterios de aceptación y entregables para asegurar resultados medibles y evitar ambigüedades.',
        iconColor: 'text-blue-500',
        items: [
          { icon: ClipboardCheck, text: 'Levantamiento de requerimientos y diagnóstico' },
          { icon: Calendar, text: 'Plan de trabajo con cronograma y responsables' },
          { icon: FileText, text: 'Documentación y trazabilidad de cambios' },
          { icon: CheckSquare, text: 'Criterios de aceptación por entrega' },
        ],
      },
      {
        icon: Shield,
        title: 'Ejecución y soporte',
        description: 'Implementamos con buenas prácticas y acompañamos con soporte, mantenimiento y mejora continua.',
        iconColor: 'text-purple-500',
        items: [
          { icon: HeadphonesIcon, text: 'Mesa de ayuda y atención por niveles' },
          { icon: Wrench, text: 'Mantenimiento preventivo y correctivo' },
          { icon: Database, text: 'Monitoreo, backups y seguridad' },
          { icon: TrendingUp, text: 'Gestión de incidencias y mejoras' },
        ],
      },
      {
        icon: Rocket,
        title: 'Escalabilidad',
        description: 'Diseñamos pensando en crecimiento: rendimiento, seguridad, monitoreo y continuidad operativa.',
        iconColor: 'text-orange-500',
        items: [
          { icon: Lightbulb, text: 'Arquitecturas escalables y mantenibles' },
          { icon: BookOpen, text: 'Estandarización y documentación' },
          { icon: Zap, text: 'Automatización y optimización' },
          { icon: RefreshCw, text: 'Mejora continua por iteraciones' },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const headerEls = headerRef.current?.querySelectorAll('[data-about="header"]');
    const cardEls = cardsRef.current?.querySelectorAll('[data-about="card"]');
    const footerWrapEls = footerRef.current?.querySelectorAll('[data-about="footer-wrap"]');
    const footerEls = footerRef.current?.querySelectorAll('[data-about="footer"]');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (headerEls && headerEls.length > 0) {
            animate(headerEls, {
              opacity: [0, 1],
              translateY: [14, 0],
              duration: 800,
              easing: 'easeOutExpo',
              delay: (_, i) => i * 90,
            });
          }

          if (cardEls && cardEls.length > 0) {
            animate(cardEls, {
              opacity: [0, 1],
              translateY: [18, 0],
              scale: [0.98, 1],
              duration: 900,
              easing: 'easeOutExpo',
              delay: (_, i) => 220 + i * 120,
            });
          }

          if (footerWrapEls && footerWrapEls.length > 0) {
            animate(footerWrapEls, {
              opacity: [0, 1],
              translateY: [14, 0],
              duration: 850,
              easing: 'easeOutExpo',
              delay: 520,
            });
          }

          if (footerEls && footerEls.length > 0) {
            animate(footerEls, {
              opacity: [0, 1],
              translateY: [10, 0],
              duration: 700,
              easing: 'easeOutExpo',
              delay: (_, i) => 640 + i * 90,
            });
          }

          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(root);

    const glows = root.querySelectorAll('[data-about="glow"]');
    if (glows.length > 0) {
      animate(glows, {
        translateY: [0, 10],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 4200,
        delay: (_, i) => i * 300,
      });
    }

    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 min-h-screen scroll-mt-0">
      <div data-about="glow" className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div data-about="glow" className="pointer-events-none absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />

      <div ref={headerRef} className="mb-12 text-center md:mb-16">
        <Badge variant="secondary" className="mb-4 font-heading opacity-0" data-about="header">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          Nosotros
        </Badge>

        <h2 className="mb-4 text-3xl font-extrabold md:text-4xl lg:text-5xl opacity-0" data-about="header">
          REDORANGE E.I.R.L.
        </h2>

        <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg opacity-0" data-about="header">
          Somos un equipo orientado a resolver necesidades reales con soluciones tecnológicas integrales: desde el diseño y la implementación hasta el soporte y la continuidad.
        </p>
      </div>

      <div ref={cardsRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {features.map((feature) => {
          const MainIcon = feature.icon;

          return (
            <div
              key={feature.title}
              data-about="card"
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-5 shadow-sm backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02] opacity-0 md:p-6"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
                  <MainIcon className={`h-8 w-8 md:h-9 md:w-9 ${feature.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-heading text-lg font-extrabold md:text-xl">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {feature.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div key={item.text} className="flex items-start gap-3 rounded-lg bg-muted/50 p-2.5 transition-all hover:bg-muted hover:-translate-y-px md:p-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center md:h-8 md:w-8">
                        <ItemIcon className={`h-4 w-4 md:h-5 md:w-5 ${feature.iconColor}`} />
                      </div>
                      <span className="text-sm leading-relaxed text-foreground">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={footerRef} className="mt-12 md:mt-16">
        <div
          data-about="footer-wrap"
          className="overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-primary/5 via-background/60 to-accent/5 p-6 text-center backdrop-blur opacity-0 md:p-8 lg:p-10"
        >
          <div className="mx-auto max-w-3xl space-y-4 md:space-y-5">
            <div className="flex items-center justify-center gap-2 opacity-0" data-about="footer">
              <Lightbulb className="h-5 w-5 text-primary md:h-6 md:w-6" />
              <h3 className="font-heading text-xl font-extrabold md:text-2xl lg:text-3xl">Trabajamos alineados a tus objetivos</h3>
            </div>

            <p className="text-sm text-muted-foreground opacity-0 md:text-base" data-about="footer">
              Cada proyecto se aborda con transparencia, comunicación constante y un enfoque iterativo que garantiza resultados tangibles y continuidad operativa.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 opacity-0 md:gap-6" data-about="footer">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-500 md:h-7 md:w-7" />
                <span className="text-xs font-semibold md:text-sm">Orientado a resultados</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-500 md:h-7 md:w-7" />
                <span className="text-xs font-semibold md:text-sm">Soporte continuo</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-orange-500 md:h-7 md:w-7" />
                <span className="text-xs font-semibold md:text-sm">Preparado para escalar</span>
              </div>
            </div>

            <div className="mx-auto mt-4 grid max-w-4xl gap-3 opacity-0 md:mt-6 md:grid-cols-3" data-about="footer">
              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-left md:p-4">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-primary md:h-5 md:w-5" />
                  <p className="font-heading text-xs font-extrabold md:text-sm">Comunicación clara</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground md:mt-2">Estado, avances y acuerdos documentados para asegurar trazabilidad y control.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-left md:p-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-accent md:h-5 md:w-5" />
                  <p className="font-heading text-xs font-extrabold md:text-sm">Calidad en entregables</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground md:mt-2">Criterios definidos, revisión y mejora continua en cada iteración.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-left md:p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                  <p className="font-heading text-xs font-extrabold md:text-sm">Continuidad operativa</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground md:mt-2">Soporte, mantenimiento y evolución para sostener la operación en el tiempo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
