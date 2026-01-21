'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Shield, Rocket, ClipboardCheck, FileText, HeadphonesIcon, Wrench, Database, Network, TrendingUp, Zap } from 'lucide-react';
import { RefreshCw, Lightbulb, MessageSquareText, BadgeCheck, Timer, Code2, Workflow, GraduationCap, HardDrive, Boxes, Router, Globe, Mail, Megaphone, SolarPanel } from 'lucide-react';

import { fn_get_about, type AboutContent, type AboutFeatureItem, type ColorTheme } from '@/actions/fn-services';
import { getBaseColorClass, getThemeClasses } from '@/helpers/theme-helpers';

interface FeatureCardUI {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  colorTheme: ColorTheme;
  items: Array<{ icon: FC<{ className?: string }>; text: string }>;
}

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICONS: Record<string, FC<{ className?: string }>> = {
  code2: Code2,
  boxes: Boxes,
  globe: Globe,
  clipboardCheck: ClipboardCheck,
  workflow: Workflow,
  database: Database,
  wrench: Wrench,
  headphones: HeadphonesIcon,
  trendingUp: TrendingUp,
  graduationCap: GraduationCap,
  hardDrive: HardDrive,
  router: Router,
  fileText: FileText,
  network: Network,
  shield: Shield,
  mail: Mail,
  megaphone: Megaphone,
  solarPanel: SolarPanel,
  messageSquareText: MessageSquareText,
  badgeCheck: BadgeCheck,
  timer: Timer,
  refreshCw: RefreshCw,
  zap: Zap,
  target: Target,
  rocket: Rocket,
};

const toUIItems = (items: AboutFeatureItem[]) => items.map((it) => ({ icon: ICONS[it.iconKey] ?? CheckCircle2Fallback, text: it.text }));

const CheckCircle2Fallback: FC<{ className?: string }> = ({ className }) => (
  <span className={className} aria-hidden="true">
    •
  </span>
);

export const AboutSection: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<AboutContent | null>(null);

  useEffect(() => {
    let mounted = true;

    fn_get_about()
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch(() => {
        if (!mounted) return;
        setData(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const features = useMemo<FeatureCardUI[]>(() => {
    if (!data) return [];

    return data.features.map((f) => {
      const MainIcon = ICONS[f.iconKey] ?? Code2;

      return { icon: MainIcon, title: f.title, description: f.description, colorTheme: f.colorTheme, items: toUIItems(f.items) };
    });
  }, [data]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (!data || features.length === 0) return;

    if (prefersReducedMotion()) {
      const show = root.querySelectorAll<HTMLElement>('[data-about="header"],[data-about="card"],[data-about="footer-wrap"],[data-about="footer"]');
      show.forEach((el) => (el.style.opacity = '1'));
      return;
    }

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
  }, [data, features.length]);

  if (!data) {
    return (
      <section id="about" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20 min-h-screen scroll-mt-0">
        <div className="relative z-10 mx-auto flex max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur">
            <p className="font-heading text-base font-extrabold">Cargando sección...</p>
            <p className="mt-1 text-sm text-muted-foreground">Preparando contenido de &quot;Sobre nosotros&ldquo;.</p>
          </div>
        </div>
      </section>
    );
  }

  const getIconColorClass = (colorTheme: ColorTheme | 'primary' | 'secondary' | 'accent'): string => {
    if (colorTheme === 'primary' || colorTheme === 'secondary' || colorTheme === 'accent') {
      return getBaseColorClass(colorTheme);
    }
    return getThemeClasses(colorTheme).text;
  };

  const footerBadges = data.footer.badges.map((b) => ({ Icon: ICONS[b.iconKey] ?? Target, label: b.label, iconColorClass: getIconColorClass(b.colorTheme) }));

  const footerCards = data.footer.cards.map((c) => ({ Icon: ICONS[c.iconKey] ?? MessageSquareText, title: c.title, description: c.description, iconColorClass: getIconColorClass(c.colorTheme) }));

  return (
    <section id="about" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20 min-h-screen scroll-mt-0">
      <div data-about="glow" className="pointer-events-none absolute -right-24 top-16 h-[420px] w-[420px] rounded-full bg-(--tech-bg) blur-3xl" />
      <div data-about="glow" className="pointer-events-none absolute -left-24 bottom-16 h-[420px] w-[420px] rounded-full bg-(--digital-bg) blur-3xl" />

      <div ref={headerRef} className="mb-10 text-center md:mb-12">
        <Badge variant="secondary" className="mb-3 font-heading opacity-0" data-about="header">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          {data.badgeLabel}
        </Badge>

        <h2 className="mb-3 text-2xl font-extrabold md:text-3xl lg:text-4xl opacity-0" data-about="header">
          <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">REDORANGE</span> E.I.R.L.
        </h2>

        <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base opacity-0" data-about="header">
          {data.intro}
        </p>
      </div>

      <div ref={cardsRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {features.map((feature) => {
          const MainIcon = feature.icon;
          const theme = getThemeClasses(feature.colorTheme);

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
                  <MainIcon className={`h-7 w-7 md:h-8 md:w-8 ${theme.text}`} />
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
                        <ItemIcon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${theme.text}`} />
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
              <h3 className="font-heading text-lg font-extrabold md:text-xl lg:text-2xl">{data.footer.title}</h3>
            </div>

            <p className="text-xs text-muted-foreground opacity-0 md:text-sm" data-about="footer">
              {data.footer.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 opacity-0 md:gap-5" data-about="footer">
              {footerBadges.map(({ Icon, label, iconColorClass }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColorClass}`} />
                  <span className="text-[10px] font-semibold md:text-xs">{label}</span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-3 grid max-w-5xl gap-2.5 opacity-0 md:mt-5 md:grid-cols-3" data-about="footer">
              {footerCards.slice(0, 3).map(({ Icon, title, description, iconColorClass }) => (
                <div key={title} className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${iconColorClass}`} />
                    <p className="font-heading text-[10px] font-extrabold md:text-xs">{title}</p>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">{description}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-3 grid max-w-5xl gap-2.5 opacity-0 md:mt-5 md:grid-cols-3" data-about="footer">
              {footerCards.slice(3, 6).map(({ Icon, title, description, iconColorClass }) => (
                <div key={title} className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-left md:p-3">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${iconColorClass}`} />
                    <p className="font-heading text-[10px] font-extrabold md:text-xs">{title}</p>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground md:mt-1.5 md:text-xs">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
