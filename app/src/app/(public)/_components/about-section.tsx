'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Target,
  Shield,
  Rocket,
  ClipboardCheck,
  FileText,
  HeadphonesIcon,
  Wrench,
  Database,
  Network,
  TrendingUp,
  Zap,
  RefreshCw,
  Lightbulb,
  MessageSquareText,
  BadgeCheck,
  Timer,
  Code2,
  Workflow,
  GraduationCap,
  HardDrive,
  Boxes,
  Router,
  Globe,
  Mail,
  Megaphone,
  SolarPanel,
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
        icon: Code2,
        title: 'Tecnología y Soluciones Informáticas (TI)',
        description: 'Consultoría, desarrollo y operación de software/sistemas, con soporte y mejora continua para asegurar continuidad operativa.',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        items: [
          { icon: ClipboardCheck, text: 'Consultoría y asesoría en informática y cómputo' },
          { icon: Code2, text: 'Desarrollo de software, sistemas y aplicaciones' },
          { icon: Workflow, text: 'Programación y construcción de sistemas informáticos' },
          { icon: Database, text: 'Gestión de redes, bases de datos e ingeniería de procesos' },
          { icon: Wrench, text: 'Administración y mantenimiento de sistemas, servidores y aplicaciones' },
          { icon: HeadphonesIcon, text: 'Mesa de ayuda, soporte técnico y documentación de procesos' },
          { icon: TrendingUp, text: 'Mejora y estandarización de procesos' },
          { icon: GraduationCap, text: 'Capacitación en herramientas informáticas' },
        ],
      },
      {
        icon: Boxes,
        title: 'Comercialización, Importación y Servicios Técnicos de Equipos',
        description: 'Provisión de tecnología con enfoque en compatibilidad, instalación, mantenimiento y postventa: desde cotización hasta puesta en marcha.',
        iconColor: 'text-rose-600 dark:text-rose-400',
        items: [
          { icon: HardDrive, text: 'Importación y exportación de equipos tecnológicos' },
          { icon: Boxes, text: 'Distribución y comercialización de equipos, suministros y periféricos' },
          { icon: Router, text: 'Equipos de telecomunicaciones y robótica' },
          { icon: FileText, text: 'Cotización y venta de equipos tecnológicos' },
          { icon: Wrench, text: 'Reparación, mantenimiento e instalación de equipos' },
          { icon: Network, text: 'Instalación de redes integrales y puesta en marcha' },
        ],
      },
      {
        icon: Globe,
        title: 'Telecomunicaciones, Servicios Digitales y Energía Tecnológica',
        description: 'Conectividad, servicios digitales y soluciones energéticas: operación segura, disponibilidad y soporte continuo para empresas.',
        iconColor: 'text-orange-600 dark:text-orange-400',
        items: [
          { icon: Network, text: 'Servicios de telecomunicaciones e internet (incluye línea dedicada)' },
          { icon: Shield, text: 'Hosting, cloud, storage y servidores de seguridad' },
          { icon: Globe, text: 'Registro de dominios y alojamiento de páginas web' },
          { icon: Mail, text: 'Correo corporativo, intranet y extranet' },
          { icon: Megaphone, text: 'Publicidad digital, diseño gráfico, animación y producción' },
          { icon: SolarPanel, text: 'Paneles solares, medición y servicios eléctricos asociados' },
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

          if (headerEls && headerEls.length > 0) animate(headerEls, { opacity: [0, 1], translateY: [14, 0], duration: 800, easing: 'easeOutExpo', delay: (_, i) => i * 90 });
          if (cardEls && cardEls.length > 0) animate(cardEls, { opacity: [0, 1], translateY: [18, 0], scale: [0.98, 1], duration: 900, easing: 'easeOutExpo', delay: (_, i) => 220 + i * 120 });
          if (footerWrapEls && footerWrapEls.length > 0) animate(footerWrapEls, { opacity: [0, 1], translateY: [14, 0], duration: 850, easing: 'easeOutExpo', delay: 520 });
          if (footerEls && footerEls.length > 0) animate(footerEls, { opacity: [0, 1], translateY: [10, 0], duration: 700, easing: 'easeOutExpo', delay: (_, i) => 640 + i * 90 });

          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(root);

    const glows = root.querySelectorAll('[data-about="glow"]');
    if (glows.length > 0) animate(glows, { translateY: [0, 10], direction: 'alternate', loop: true, easing: 'easeInOutSine', duration: 4200, delay: (_, i) => i * 300 });

    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20 min-h-screen scroll-mt-0">
      <div data-about="glow" className="pointer-events-none absolute -right-24 top-16 h-[420px] w-[420px] rounded-full bg-cyan-500/6 blur-3xl" />
      <div data-about="glow" className="pointer-events-none absolute -left-24 bottom-16 h-[420px] w-[420px] rounded-full bg-orange-500/6 blur-3xl" />

      <div ref={headerRef} className="mb-10 text-center md:mb-12">
        <Badge variant="secondary" className="mb-3 font-heading opacity-0" data-about="header">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          Nosotros
        </Badge>

        <h2 className="mb-3 text-2xl font-extrabold md:text-3xl lg:text-4xl opacity-0" data-about="header">
          <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">REDORANGE</span> E.I.R.L.
        </h2>

        <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base opacity-0" data-about="header">
          Organizamos nuestras capacidades en tres líneas claras para evitar cruces de alcance: TI (desarrollo y operación), Equipos (provisión y postventa) y Telecom/Digital/Energía (conectividad, servicios
          digitales y energía).
        </p>
      </div>

      <div ref={cardsRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {features.map((feature) => {
          const MainIcon = feature.icon;

          return (
            <div
              key={feature.title}
              data-about="card"
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-4 shadow-sm backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02] opacity-0 md:p-5"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12">
                  <MainIcon className={`h-7 w-7 md:h-8 md:w-8 ${feature.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1.5 font-heading text-base font-extrabold md:text-lg">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed md:text-xs">{feature.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {feature.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div key={item.text} className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2 transition-all hover:bg-muted hover:-translate-y-px md:p-2.5">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center md:h-7 md:w-7">
                        <ItemIcon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${feature.iconColor}`} />
                      </div>
                      <span className="text-xs leading-relaxed text-foreground md:text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={footerRef} className="mt-10 md:mt-14">
        <div
          data-about="footer-wrap"
          className="overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-primary/5 via-background/60 to-accent/5 p-5 text-center backdrop-blur opacity-0 md:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-4xl space-y-3 md:space-y-4">
            <div className="flex items-center justify-center gap-2 opacity-0" data-about="footer">
              <Lightbulb className="h-4 w-4 text-primary md:h-5 md:w-5" />
              <h3 className="font-heading text-lg font-extrabold md:text-xl lg:text-2xl">Una forma de trabajo clara y medible</h3>
            </div>

            <p className="text-xs text-muted-foreground opacity-0 md:text-sm" data-about="footer">
              Alineamos alcance, ejecución y soporte con comunicación constante. Así aseguramos trazabilidad, calidad de entregables y continuidad operativa.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 opacity-0 md:gap-5" data-about="footer">
              <div className="flex items-center gap-1.5">
                <Target className="h-5 w-5 text-blue-500 md:h-6 md:w-6" />
                <span className="text-[10px] font-semibold md:text-xs">Alcance definido</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-5 w-5 text-purple-500 md:h-6 md:w-6" />
                <span className="text-[10px] font-semibold md:text-xs">Operación segura</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Rocket className="h-5 w-5 text-orange-500 md:h-6 md:w-6" />
                <span className="text-[10px] font-semibold md:text-xs">Listo para escalar</span>
              </div>
            </div>

            <div className="mx-auto mt-3 grid max-w-5xl gap-2.5 opacity-0 md:mt-5 md:grid-cols-3" data-about="footer">
              <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                <div className="flex items-center gap-1.5">
                  <MessageSquareText className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
                  <p className="font-heading text-[10px] font-extrabold md:text-xs">Comunicación y trazabilidad</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">Levantamiento, acuerdos, cambios y estado del trabajo documentados para control total.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-accent md:h-4 md:w-4" />
                  <p className="font-heading text-[10px] font-extrabold md:text-xs">Calidad en entregables</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">Criterios definidos, validación por hitos y mejora continua por iteraciones.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                <div className="flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5 text-secondary md:h-4 md:w-4" />
                  <p className="font-heading text-[10px] font-extrabold md:text-xs">Continuidad operativa</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">Soporte, mantenimiento y evolución para sostener la operación y reducir riesgos.</p>
              </div>
            </div>

            <div className="mx-auto mt-3 grid max-w-5xl gap-2.5 opacity-0 md:mt-5 md:grid-cols-3" data-about="footer">
              <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                <div className="flex items-center gap-1.5">
                  <ClipboardCheck className="h-3.5 w-3.5 text-blue-500 md:h-4 md:w-4" />
                  <p className="font-heading text-[10px] font-extrabold md:text-xs">Plan y responsables</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">Cronograma, responsables y criterios de aceptación por entrega para evitar ambigüedades.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-purple-500 md:h-4 md:w-4" />
                  <p className="font-heading text-[10px] font-extrabold md:text-xs">Soporte por SLA</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">Atención por niveles, correctivos y preventivos con seguimiento y reportes.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-orange-500 md:h-4 md:w-4" />
                  <p className="font-heading text-[10px] font-extrabold md:text-xs">Optimización continua</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">Estandarización, automatización y mejoras para rendimiento y escalabilidad.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
