'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

const CheckCircle2Fallback: FC<{ className?: string }> = ({ className }) => (
  <span className={className} aria-hidden="true">
    •
  </span>
);

const toUIItems = (items: AboutFeatureItem[]) =>
  items.map((it) => ({
    icon: ICONS[it.iconKey] ?? CheckCircle2Fallback,
    text: it.text,
  }));

const AboutSectionSkeleton: FC = () => (
  <section id="about" className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-20 min-h-[50vh] sm:min-h-screen scroll-mt-0" aria-busy="true" aria-live="polite">
    <div className="pointer-events-none absolute -right-16 sm:-right-24 top-12 sm:top-16 h-[250px] sm:h-[420px] w-[250px] sm:w-[420px] rounded-full bg-(--tech-bg) blur-3xl opacity-30" aria-hidden="true" />
    <div
      className="pointer-events-none absolute -left-16 sm:-left-24 bottom-12 sm:bottom-16 h-[250px] sm:h-[420px] w-[250px] sm:w-[420px] rounded-full bg-(--digital-bg) blur-3xl opacity-30"
      aria-hidden="true"
    />

    <div className="mb-8 sm:mb-10 md:mb-12 text-center">
      <div className="mx-auto mb-3 flex w-fit items-center justify-center gap-2">
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      <div className="mx-auto space-y-2">
        <Skeleton className="mx-auto h-9 w-[min(520px,90%)] rounded-xl" />
        <Skeleton className="mx-auto h-4 w-[min(760px,92%)] rounded-lg" />
        <Skeleton className="mx-auto h-4 w-[min(680px,88%)] rounded-lg" />
      </div>
    </div>

    <div className="grid gap-3 sm:gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-background/60 p-3.5 sm:p-4 md:p-5 shadow-sm backdrop-blur" aria-hidden="true">
          <div className="mb-3 sm:mb-4 flex items-start gap-2.5 sm:gap-3">
            <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-[80%] rounded-lg" />
              <Skeleton className="h-3.5 w-[95%] rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-2 sm:p-2.5">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-4 w-[85%] rounded-lg" />
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-2 sm:p-2.5">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-4 w-[78%] rounded-lg" />
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-2 sm:p-2.5">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-4 w-[70%] rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 sm:mt-10 md:mt-14">
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-linear-to-br from-primary/5 via-background/60 to-accent/5 p-4 sm:p-5 md:p-6 lg:p-8 text-center backdrop-blur">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="mx-auto flex items-center justify-center gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-6 w-[min(360px,70%)] rounded-lg" />
          </div>

          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-[min(740px,92%)] rounded-lg" />
            <Skeleton className="mx-auto h-4 w-[min(640px,86%)] rounded-lg" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-3 grid max-w-5xl gap-2 sm:gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, k) => (
              <div key={k} className="rounded-lg sm:rounded-xl border border-border/70 bg-background/60 p-2 sm:p-2.5 md:p-3 text-left">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-[70%] rounded-lg" />
                </div>
                <Skeleton className="mt-2 h-3.5 w-[95%] rounded-lg" />
                <Skeleton className="mt-1.5 h-3.5 w-[85%] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
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

  if (!data) return <AboutSectionSkeleton />;

  const getIconColorClass = (colorTheme: ColorTheme | 'primary' | 'secondary' | 'accent'): string => {
    if (colorTheme === 'primary' || colorTheme === 'secondary' || colorTheme === 'accent') return getBaseColorClass(colorTheme);

    return getThemeClasses(colorTheme).text;
  };

  const footerBadges = data.footer.badges.map((b) => ({
    Icon: ICONS[b.iconKey] ?? Target,
    label: b.label,
    iconColorClass: getIconColorClass(b.colorTheme),
  }));

  const footerCards = data.footer.cards.map((c) => ({
    Icon: ICONS[c.iconKey] ?? MessageSquareText,
    title: c.title,
    description: c.description,
    iconColorClass: getIconColorClass(c.colorTheme),
  }));

  return (
    <section id="about" ref={sectionRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-20 min-h-[50vh] sm:min-h-screen scroll-mt-0">
      <div
        data-about="glow"
        className="pointer-events-none absolute -right-16 sm:-right-24 top-12 sm:top-16 h-[250px] sm:h-[420px] w-[250px] sm:w-[420px] rounded-full bg-(--tech-bg) blur-3xl opacity-50 sm:opacity-100"
      />
      <div
        data-about="glow"
        className="pointer-events-none absolute -left-16 sm:-left-24 bottom-12 sm:bottom-16 h-[250px] sm:h-[420px] w-[250px] sm:w-[420px] rounded-full bg-(--digital-bg) blur-3xl opacity-50 sm:opacity-100"
      />

      <div ref={headerRef} className="mb-8 sm:mb-10 md:mb-12 text-center">
        <Badge variant="secondary" className="mb-2 sm:mb-3 font-heading text-xs opacity-0" data-about="header">
          <Users className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {data.badgeLabel}
        </Badge>

        <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold opacity-0" data-about="header">
          <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">REDORANGE</span> E.I.R.L.
        </h2>

        <p className="mx-auto max-w-3xl text-xs sm:text-sm md:text-base text-muted-foreground opacity-0" data-about="header">
          {data.intro}
        </p>
      </div>

      <div ref={cardsRef} className="grid gap-3 sm:gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const MainIcon = feature.icon;
          const theme = getThemeClasses(feature.colorTheme);

          return (
            <div
              key={feature.title}
              data-about="card"
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-background/60 p-3.5 sm:p-4 md:p-5 shadow-sm backdrop-blur transition-all hover:shadow-lg hover:scale-[1.02] opacity-0"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="mb-3 sm:mb-4 flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 shrink-0 items-center justify-center">
                  <MainIcon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${theme.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 sm:mb-1.5 font-heading text-sm sm:text-base md:text-lg font-extrabold line-clamp-2">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">{feature.description}</p>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                {feature.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div key={item.text} className="flex items-start gap-2 sm:gap-2.5 rounded-lg bg-muted/50 p-2 sm:p-2.5 transition-all hover:bg-muted hover:-translate-y-px">
                      <div className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 shrink-0 items-center justify-center">
                        <ItemIcon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${theme.text}`} />
                      </div>
                      <span className="text-[10px] sm:text-xs md:text-sm leading-relaxed text-foreground line-clamp-2 sm:line-clamp-none">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={footerRef} className="mt-8 sm:mt-10 md:mt-14">
        <div
          data-about="footer-wrap"
          className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-linear-to-br from-primary/5 via-background/60 to-accent/5 p-4 sm:p-5 md:p-6 lg:p-8 text-center backdrop-blur opacity-0"
        >
          <div className="mx-auto max-w-4xl space-y-2.5 sm:space-y-3 md:space-y-4">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 opacity-0" data-about="footer">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h3 className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold">{data.footer.title}</h3>
            </div>

            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground opacity-0" data-about="footer">
              {data.footer.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-5 pt-1 opacity-0" data-about="footer">
              {footerBadges.map(({ Icon, label, iconColorClass }) => (
                <div key={label} className="flex items-center gap-1 sm:gap-1.5">
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${iconColorClass}`} />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-2.5 sm:mt-3 md:mt-5 grid max-w-5xl gap-2 sm:gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 opacity-0" data-about="footer">
              {footerCards.slice(0, 3).map(({ Icon, title, description, iconColorClass }) => (
                <div key={title} className="rounded-lg sm:rounded-xl border border-border/70 bg-background/60 p-2 sm:p-2.5 md:p-3 text-left">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${iconColorClass}`} />
                    <p className="font-heading text-[9px] sm:text-[10px] md:text-xs font-extrabold truncate">{title}</p>
                  </div>
                  <p className="mt-0.5 sm:mt-1 md:mt-1.5 text-[9px] sm:text-[10px] md:text-xs text-muted-foreground line-clamp-2">{description}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-2 sm:mt-2.5 md:mt-5 grid max-w-5xl gap-2 sm:gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 opacity-0" data-about="footer">
              {footerCards.slice(3, 6).map(({ Icon, title, description, iconColorClass }) => (
                <div key={title} className="rounded-lg sm:rounded-xl border border-border/70 bg-background/60 p-2 sm:p-2.5 md:p-3 text-left">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${iconColorClass}`} />
                    <p className="font-heading text-[9px] sm:text-[10px] md:text-xs font-extrabold truncate">{title}</p>
                  </div>
                  <p className="mt-0.5 sm:mt-1 md:mt-1.5 text-[9px] sm:text-[10px] md:text-xs text-muted-foreground line-clamp-2">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
