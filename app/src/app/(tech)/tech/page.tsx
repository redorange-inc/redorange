'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Headphones, Settings, ShieldCheck, Wrench, TrendingUp, Clock, Award, Zap, ArrowRight, Sparkles, Activity, Server, Database, Code2 } from 'lucide-react';

/** ✅ FIX #1: permitir `style` y cualquier prop HTML */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SkeletonPulse = ({ className = '', ...props }: SkeletonProps) => <div className={`animate-pulse rounded-xl bg-muted ${className}`} {...props} />;

const SkeletonStatCard = () => (
  <div className="rounded-2xl border border-border/60 bg-background/40 p-3 backdrop-blur">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-10 w-10 rounded-xl" />
      <div className="text-right space-y-2">
        <SkeletonPulse className="h-6 w-16 ml-auto" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    </div>
  </div>
);

const SkeletonAchievementCard = () => (
  <Card className="rounded-3xl border-border/40 bg-background/40 backdrop-blur">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-10 w-10 rounded-2xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-3 w-20" />
          </div>
        </div>
        <SkeletonPulse className="h-9 w-16 rounded-2xl" />
      </div>
    </CardContent>
  </Card>
);

const SkeletonChart = () => (
  <div className="h-[300px] w-full p-4">
    <div className="flex h-full items-end justify-between gap-3">
      {[65, 85, 45, 90, 70, 55].map((height, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <SkeletonPulse className="w-full rounded-t-lg" style={{ height: `${height}%` }} />
          <SkeletonPulse className="h-3 w-12" />
        </div>
      ))}
    </div>
  </div>
);

interface Stat {
  key: 'projects' | 'clients' | 'tickets' | 'uptime';
  label: string;
  value: number;
  suffix?: string;
  helper?: string;
  icon: React.ReactNode;
}

interface ImpactRow {
  area: string;
  value: number;
  [key: string]: string | number;
}

interface Achievement {
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
}

interface TimeSeriesData {
  month: string;
  rendimiento: number;
  satisfaccion: number;
}

interface ServiceItem {
  text: string;
  icon: React.ReactNode;
}

type AnimatedMap = Record<string, number>;

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    value?: number | string;
    name?: string;
    dataKey?: string;
    color?: string;
  }>;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    name?: string;
    payload?: {
      area?: string;
      value?: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <Card className="border-(--tech-border) bg-background/95 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="text-sm font-bold text-foreground mb-2">{String(label ?? '')}</div>
        <div className="space-y-1.5">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold text-foreground">{String(entry.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PieCustomTooltip = ({ active, payload }: PieTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <Card className="border-(--tech-border) bg-background/95 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="text-sm font-bold text-foreground mb-1">{data.payload?.area}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Impacto:</span>
          <span className="font-bold text-tech">{data.payload?.value}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ✅ FIX #2: Recharts (SVG) a veces NO renderiza bien con `var(--tech)` en `stroke/stopColor`.
 * Usamos colores HEX reales para los charts.
 */
const TECH = '#06b6d4';
const TECH_ACCENT = '#0891b2';

// Colores del pie (hex)
const PIE_COLORS = ['#06b6d4', '#22d3ee', '#67e8f9', '#0891b2', '#0e7490', '#a5f3fc'];

const ui = {
  glassCard: 'border-border/40 bg-background/40 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.25)] backdrop-blur-xl',
  softBorder: 'border border-border/50',
  hoverLift: 'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(6,182,212,0.4)]',
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const statsConfig = useMemo<Stat[]>(
    () => [
      {
        key: 'projects',
        label: 'Proyectos ejecutados',
        value: 127,
        helper: 'Implementaciones completadas',
        icon: <Wrench className="h-4 w-4" />,
      },
      {
        key: 'clients',
        label: 'Clientes atendidos',
        value: 58,
        helper: 'Empresas y organizaciones',
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        key: 'tickets',
        label: 'Tickets resueltos',
        value: 4280,
        helper: 'Mesa de ayuda y soporte',
        icon: <Headphones className="h-4 w-4" />,
      },
      {
        key: 'uptime',
        label: 'Disponibilidad',
        value: 99.8,
        suffix: '%',
        helper: 'Servicios críticos',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    [],
  );

  const impactDataFinal = useMemo<ImpactRow[]>(
    () => [
      { area: 'Desarrollo', value: 92 },
      { area: 'Infraestructura', value: 88 },
      { area: 'Redes', value: 76 },
      { area: 'Soporte', value: 95 },
      { area: 'Automatización', value: 84 },
      { area: 'Capacitación', value: 71 },
    ],
    [],
  );

  const timeSeriesDataFinal = useMemo<TimeSeriesData[]>(
    () => [
      { month: 'Ene', rendimiento: 78, satisfaccion: 85 },
      { month: 'Feb', rendimiento: 82, satisfaccion: 88 },
      { month: 'Mar', rendimiento: 85, satisfaccion: 90 },
      { month: 'Abr', rendimiento: 79, satisfaccion: 82 },
      { month: 'May', rendimiento: 88, satisfaccion: 92 },
      { month: 'Jun', rendimiento: 91, satisfaccion: 94 },
      { month: 'Jul', rendimiento: 93, satisfaccion: 95 },
      { month: 'Ago', rendimiento: 90, satisfaccion: 91 },
      { month: 'Sep', rendimiento: 94, satisfaccion: 96 },
      { month: 'Oct', rendimiento: 96, satisfaccion: 97 },
      { month: 'Nov', rendimiento: 95, satisfaccion: 96 },
      { month: 'Dic', rendimiento: 98, satisfaccion: 99 },
    ],
    [],
  );

  const serviceItems = useMemo<ServiceItem[]>(
    () => [
      { text: 'Consultoría y asesoría en informática y cómputo', icon: <Code2 className="h-5 w-5" /> },
      { text: 'Desarrollo de software, sistemas y aplicaciones', icon: <Database className="h-5 w-5" /> },
      { text: 'Programación y construcción de sistemas informáticos', icon: <Server className="h-5 w-5" /> },
      { text: 'Administración y mantenimiento de sistemas, servidores y aplicaciones', icon: <Settings className="h-5 w-5" /> },
      { text: 'Gestión de redes, bases de datos, mejora de procesos y capacitación', icon: <Activity className="h-5 w-5" /> },
      { text: 'Monitoreo, disponibilidad y continuidad operativa', icon: <ShieldCheck className="h-5 w-5" /> },
    ],
    [],
  );

  const achievements = useMemo<Achievement[]>(
    () => [
      { title: 'Respuesta rápida', description: 'Tiempo promedio', metric: '< 15 min', icon: <Clock className="h-4 w-4" /> },
      { title: 'Certificaciones', description: 'Equipo certificado', metric: '28+', icon: <Award className="h-4 w-4" /> },
      { title: 'Automatización', description: 'Procesos optimizados', metric: '65%', icon: <Zap className="h-4 w-4" /> },
    ],
    [],
  );

  const [animatedValues, setAnimatedValues] = useState<AnimatedMap>({ projects: 0, clients: 0, tickets: 0, uptime: 0 });

  const [impactData, setImpactData] = useState<ImpactRow[]>(impactDataFinal.map((d) => ({ ...d, value: 0 })));
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>(timeSeriesDataFinal.map((d) => ({ ...d, rendimiento: 0, satisfaccion: 0 })));

  const animationStarted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = serviceItems.length;

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % totalSlides), 5000);
    return () => clearInterval(interval);
  }, [isLoading, totalSlides]);

  useEffect(() => {
    if (isLoading) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimatedValues({
      projects: statsConfig.find((s) => s.key === 'projects')?.value ?? 0,
      clients: statsConfig.find((s) => s.key === 'clients')?.value ?? 0,
      tickets: statsConfig.find((s) => s.key === 'tickets')?.value ?? 0,
      uptime: statsConfig.find((s) => s.key === 'uptime')?.value ?? 0,
    });

    setImpactData(impactDataFinal);
    setTimeSeriesData(timeSeriesDataFinal);
  }, [isLoading, statsConfig, impactDataFinal, timeSeriesDataFinal]);

  useEffect(() => {
    if (isLoading || animationStarted.current) return;
    animationStarted.current = true;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="fade-up"]'));
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px) scale(0.98)';
    });

    elements.forEach((el, idx) => {
      animate(el, { opacity: [0, 1], transform: ['translateY(24px) scale(0.98)', 'translateY(0px) scale(1)'], duration: 800, easing: 'easeOutExpo', delay: 100 + 80 * idx });
    });

    statsConfig.forEach((s) => {
      const obj = { v: 0 };
      animate(obj, {
        v: s.value,
        duration: 1800,
        easing: 'easeOutExpo',
        delay: 200,
        update: () => {
          setAnimatedValues((prev) => ({ ...prev, [s.key]: Number.isInteger(s.value) ? Math.round(obj.v) : Number(obj.v.toFixed(1)) }));
        },
      });
    });

    impactDataFinal.forEach((row, idx) => {
      const obj = { v: 0 };
      animate(obj, {
        v: row.value,
        duration: 2000,
        easing: 'easeOutQuart',
        delay: 400 + idx * 80,
        update: () => {
          setImpactData((prev) => {
            const newData = [...prev];
            newData[idx] = { area: row.area, value: Math.round(obj.v) };
            return newData;
          });
        },
      });
    });

    timeSeriesDataFinal.forEach((row, idx) => {
      const obj = { r: 0, s: 0 };
      animate(obj, {
        r: row.rendimiento,
        s: row.satisfaccion,
        duration: 2500,
        easing: 'easeOutQuart',
        delay: 600 + idx * 60,
        update: () => {
          setTimeSeriesData((prev) => {
            const newData = [...prev];
            newData[idx] = { month: row.month, rendimiento: Math.round(obj.r), satisfaccion: Math.round(obj.s) };
            return newData;
          });
        },
      });
    });

    const particles = document.querySelectorAll<HTMLElement>('[data-particle]');
    particles.forEach((particle, idx) => {
      animate(particle, { translateY: [0, -15, 0], translateX: [0, idx % 2 === 0 ? 8 : -8, 0], opacity: [0.3, 0.6, 0.3], duration: 4000 + idx * 500, easing: 'easeInOutSine', loop: true, delay: idx * 200 });
    });
  }, [isLoading, statsConfig, impactDataFinal, timeSeriesDataFinal]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-background pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div data-particle className="absolute -top-24 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-(--tech-gradient-from) blur-3xl" />
        <div data-particle className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-(--tech-accent)/20 blur-3xl" />
        <div data-particle className="absolute right-[-160px] top-[240px] h-[420px] w-[420px] rounded-full bg-(--tech-gradient-via) blur-3xl" />
        <div data-particle className="absolute left-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-tech-muted blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.04),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[900px] h-[900px] opacity-[0.12] dark:opacity-[0.08]">
            <Image src="/img/tech.png" alt="" fill className="object-contain" priority />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <SkeletonPulse className="h-6 w-48 rounded-full" />
                  <SkeletonPulse className="h-6 w-32 rounded-full" />
                </div>
                <SkeletonPulse className="h-12 w-full max-w-lg" />
                <SkeletonPulse className="h-12 w-3/4" />
                <SkeletonPulse className="h-5 w-full max-w-xl" />
                <div className="flex gap-3 mt-6">
                  <SkeletonPulse className="h-10 w-32 rounded-lg" />
                  <SkeletonPulse className="h-10 w-28 rounded-lg" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3 mt-7">
                  {[1, 2, 3].map((i) => (
                    <SkeletonPulse key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-background/60 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105">
                    <Sparkles className="mr-1 h-3.5 w-3.5 text-tech animate-pulse" />
                    Operación crítica & continuidad
                  </Badge>
                  <Badge className="rounded-full bg-tech-solid text-white">SLA • Soporte • Desarrollo</Badge>
                </div>

                <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  Tecnología y Soluciones Informáticas
                  <span className="ml-2 text-tech relative">
                    (TI)
                    <span className="absolute -bottom-1 left-0 right-0 h-1 gradient-tech rounded-full" />
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-base text-muted-foreground">Consultoría, desarrollo, soporte y continuidad operativa con métricas claras y enfoque en resultados.</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className={`bg-tech hover:bg-tech-accent text-white ${ui.hoverLift} group`}>
                    Ir al servicio
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" className={`bg-background/50 backdrop-blur hover:bg-background/70 ${ui.hoverLift}`}>
                    Ver detalle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    { title: 'Soporte 24/7', desc: 'Según SLA y criticidad', icon: <Headphones className="h-4 w-4" /> },
                    { title: 'Entrega ágil', desc: 'Ciclos cortos y medibles', icon: <Zap className="h-4 w-4" /> },
                    { title: 'Seguridad', desc: 'Buenas prácticas y hardening', icon: <ShieldCheck className="h-4 w-4" /> },
                  ].map((h) => (
                    <div key={h.title} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group cursor-default`}>
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-tech p-1.5 text-tech transition-transform group-hover:scale-110">{h.icon}</div>
                        <div className="text-xs font-semibold text-foreground">{h.title}</div>
                      </div>
                      <div className="mt-1.5 text-xs text-muted-foreground">{h.desc}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-5">
            <Card className={`relative overflow-hidden rounded-3xl ${ui.glassCard}`} data-anim="fade-up">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-(--tech-gradient-from) blur-2xl animate-pulse" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-(--tech-accent)/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Vista general</div>
                    <div className="mt-1 text-xs text-muted-foreground">Capacidades y entregables</div>
                  </div>
                  <Badge className="rounded-full bg-foreground text-background transition-transform hover:scale-105">TI</Badge>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {isLoading ? (
                    <>
                      <SkeletonStatCard />
                      <SkeletonStatCard />
                      <SkeletonStatCard />
                      <SkeletonStatCard />
                    </>
                  ) : (
                    statsConfig.map((s) => (
                      <div key={s.key} className={`rounded-2xl ${ui.softBorder} bg-background/40 p-3 backdrop-blur ${ui.hoverLift} group`}>
                        <div className="flex items-center justify-between">
                          <div className="rounded-xl bg-tech p-2 text-tech transition-all group-hover:scale-110 group-hover:rotate-3">{s.icon}</div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground tabular-nums">
                              {animatedValues[s.key]}
                              {s.suffix ?? ''}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{s.label}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl bg-background/40 p-4 backdrop-blur">
                  {isLoading ? (
                    <div className="space-y-2">
                      <SkeletonPulse className="h-4 w-32" />
                      <SkeletonPulse className="h-3 w-full" />
                      <SkeletonPulse className="h-3 w-4/5" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-tech" />
                        Modalidad flexible
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Por proyecto, mensual o demanda según SLA. Cobertura adaptable a picos operativos.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <div className={`rounded-3xl ${ui.glassCard} relative`}>
            <div className="pt-0">
              {isLoading ? (
                <div className="rounded-2xl border border-border/50 bg-background/40 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <SkeletonPulse className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <SkeletonPulse className="h-5 w-full" />
                      <SkeletonPulse className="h-5 w-3/4" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden min-h-[80px]">
                  {serviceItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`transition-all duration-500 ${idx === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 absolute inset-0'}`}
                      style={{ display: idx === currentSlide ? 'block' : 'none' }}
                    >
                      <div className={`group flex items-center gap-4 rounded-2xl ${ui.softBorder} bg-background/40 p-5 backdrop-blur ${ui.hoverLift}`}>
                        <div className="rounded-xl bg-tech p-3 text-tech transition-all group-hover:scale-110">{item.icon}</div>
                        <div className="text-base font-medium text-foreground">{item.text}</div>
                      </div>
                    </div>
                  ))}

                  {!isLoading && (
                    <div className="absolute bottom-3 right-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-tech' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-12" data-anim="fade-up">
          <Card className={`rounded-3xl lg:col-span-6 ${ui.glassCard}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <TrendingUp className="h-5 w-5 text-tech" />
                Impacto por área
              </CardTitle>
              <CardDescription className="text-sm">Resultados medibles en cada especialidad</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonChart />
              ) : (
                <div className="h-[300px] min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {PIE_COLORS.map((color, index) => (
                          <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={impactData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="area"
                        stroke="none"
                        labelLine={false}
                        label={(props) => {
                          const { cx, cy, midAngle, outerRadius, payload } = props as {
                            cx: number;
                            cy: number;
                            midAngle: number;
                            outerRadius: number;
                            payload: ImpactRow;
                          };
                          const RADIAN = Math.PI / 180;
                          const radius = (outerRadius ?? 100) + 25;
                          const angle = midAngle ?? 0;
                          const x = (cx ?? 0) + radius * Math.cos(-angle * RADIAN);
                          const y = (cy ?? 0) + radius * Math.sin(-angle * RADIAN);
                          return (
                            <text x={x} y={y} fill="currentColor" className="text-[10px] fill-muted-foreground" textAnchor={x > (cx ?? 0) ? 'start' : 'end'} dominantBaseline="central">
                              {payload.area} ({payload.value}%)
                            </text>
                          );
                        }}
                      >
                        {impactData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#pieGradient-${index})`}
                            className="transition-all duration-300 hover:opacity-80"
                            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                          />
                        ))}
                      </Pie>
                      <ReTooltip content={<PieCustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {!isLoading && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {impactData.map((item, idx) => (
                    <div key={item.area} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                      <span className="text-[10px] text-muted-foreground">{item.area}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`rounded-3xl lg:col-span-6 ${ui.glassCard}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <Activity className="h-5 w-5 text-tech-accent" />
                Tendencia anual
              </CardTitle>
              <CardDescription className="text-sm">Evolución de métricas clave 2024</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonChart />
              ) : (
                <div className="h-[300px] min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                      <defs>
                        <linearGradient id="rendimientoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={TECH} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={TECH} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="satisfaccionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={TECH_ACCENT} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={TECH_ACCENT} stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" tick={{ fill: 'currentColor' }} />
                      <YAxis tickLine={false} axisLine={false} width={35} className="text-xs" tick={{ fill: 'currentColor' }} domain={[0, 100]} />
                      <ReTooltip content={(props) => <CustomTooltip {...(props as unknown as CustomTooltipProps)} />} />

                      <Area type="monotone" dataKey="rendimiento" name="Rendimiento" stroke={TECH} strokeWidth={2} fill="url(#rendimientoGrad)" />
                      <Area type="monotone" dataKey="satisfaccion" name="Satisfacción" stroke={TECH_ACCENT} strokeWidth={2} fill="url(#satisfaccionGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {!isLoading && (
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: TECH }} />
                    <span className="text-xs text-muted-foreground">Rendimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: TECH_ACCENT }} />
                    <span className="text-xs text-muted-foreground">Satisfacción</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Logros destacados</h3>
            <Badge className="rounded-full bg-background/60 text-foreground backdrop-blur">KPIs</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {isLoading ? (
              <>
                <SkeletonAchievementCard />
                <SkeletonAchievementCard />
                <SkeletonAchievementCard />
              </>
            ) : (
              achievements.map((achievement, idx) => (
                <Card key={idx} className={`rounded-3xl ${ui.glassCard} ${ui.hoverLift}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-tech p-3 text-tech">{achievement.icon}</div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-foreground px-4 py-2 text-sm font-bold text-background shadow-lg">{achievement.metric}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <Card className="relative overflow-hidden rounded-3xl border-(--tech-border) bg-linear-to-r from-(--tech-bg) via-tech-muted to-background/80 shadow-[0_20px_70px_-45px_rgba(6,182,212,0.6)] backdrop-blur">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-(--tech-gradient-from) blur-2xl animate-pulse" />
            <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-(--tech-accent)/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <CardContent className="relative p-6">
              {isLoading ? (
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl space-y-3">
                    <SkeletonPulse className="h-7 w-80" />
                    <SkeletonPulse className="h-4 w-full max-w-lg" />
                    <div className="flex gap-2 mt-3">
                      {[1, 2, 3, 4].map((i) => (
                        <SkeletonPulse key={i} className="h-6 w-20 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <SkeletonPulse className="h-12 w-40 rounded-lg" />
                    <SkeletonPulse className="h-12 w-36 rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-bold text-foreground">¿Listo para optimizar tu infraestructura TI?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Hablemos sobre cómo impulsar tu organización con soluciones tecnológicas modernas, seguras y medibles.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Evaluación', 'Roadmap', 'Implementación', 'Soporte'].map((t) => (
                        <Badge key={t} className="rounded-full bg-background/60 text-foreground backdrop-blur transition-transform hover:scale-105">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className={`bg-tech hover:bg-tech-accent text-white ${ui.hoverLift} group`}>
                      Solicitar cotización
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button size="lg" variant="outline" className={`bg-background/50 backdrop-blur hover:bg-background/70 ${ui.hoverLift}`}>
                      Agendar llamada
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default Page;
