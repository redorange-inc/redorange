'use client';

import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Target, Shield, Rocket, ClipboardCheck, Calendar, FileText, CheckSquare, HeadphonesIcon, Wrench, Database, TrendingUp, BookOpen, Zap, RefreshCw, Users, Lightbulb } from 'lucide-react';

interface FeatureCard {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  items: Array<{ icon: FC<{ className?: string }>; text: string }>;
}

export const AboutSection: FC = () => {
  const features: FeatureCard[] = [
    {
      icon: Target,
      title: 'Claridad en alcance',
      description: 'Definimos objetivos, criterios de aceptación y entregables para asegurar resultados medibles y evitar ambigüedades.',
      color: 'from-blue-500 to-cyan-500',
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
      color: 'from-purple-500 to-pink-500',
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
      color: 'from-orange-500 to-red-500',
      items: [
        { icon: Lightbulb, text: 'Arquitecturas escalables y mantenibles' },
        { icon: BookOpen, text: 'Estandarización y documentación' },
        { icon: Zap, text: 'Automatización y optimización' },
        { icon: RefreshCw, text: 'Mejora continua por iteraciones' },
      ],
    },
  ];

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 min-h-screen scroll-mt-28">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />

      {/* Header */}
      <div className="mb-16 text-center">
        <Badge variant="secondary" className="mb-4 font-heading">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          Nosotros
        </Badge>
        <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">REDORANGE E.I.R.L.</h2>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
          Somos un equipo orientado a resolver necesidades reales con soluciones tecnológicas integrales: desde el diseño y la implementación hasta el soporte y la continuidad.
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const MainIcon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-6 shadow-sm backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              {/* Icon header */}
              <div className="mb-6 flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${feature.color} shadow-lg`}>
                  <MainIcon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-heading text-xl font-extrabold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {feature.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div key={item.text} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${feature.color}`}>
                        <ItemIcon className="h-4 w-4 text-white" />
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

      {/* Bottom CTA section */}
      <div className="mt-16 rounded-2xl border border-border/70 bg-linear-to-br from-primary/5 via-background/60 to-accent/5 p-8 text-center backdrop-blur">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h3 className="font-heading text-2xl font-extrabold">Trabajamos alineados a tus objetivos</h3>
          </div>
          <p className="text-muted-foreground">Cada proyecto se aborda con transparencia, comunicación constante y un enfoque iterativo que garantiza resultados tangibles y continuidad operativa.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-semibold">Orientado a resultados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm font-semibold">Soporte continuo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                <Rocket className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-sm font-semibold">Preparado para escalar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
