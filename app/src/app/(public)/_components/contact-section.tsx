'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Sparkles, MapPin, Clock, Mail, Phone, Cpu, Boxes, Globe, CheckCircle2, Hash } from 'lucide-react';

import { fn_get_contact, type ContactContent, type ContactLine as ContactLineDTO, type ColorTheme } from '@/actions/fn-services';
import { getThemeClasses } from '@/helpers/theme-helpers';

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface ThemeStyles {
  text: string;
  bg: string;
  border: string;
  ring: string;
}

type ContactLineUI = {
  key: ContactLineDTO['key'];
  number: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  emailBodyLine: string;
  colorTheme: ColorTheme;
  theme: ThemeStyles;
  icon: FC<{ className?: string }>;
  bullets: Array<{ icon: FC<{ className?: string }>; text: string }>;
  subjectPlaceholder: string;
};

const ICONS: Record<ContactLineDTO['iconKey'], FC<{ className?: string }>> = {
  cpu: Cpu,
  boxes: Boxes,
  globe: Globe,
};

const BULLET_ICONS: Record<'checkCircle2', FC<{ className?: string }>> = {
  checkCircle2: CheckCircle2,
};

const EllipsisMarquee: FC<{ text: string; className?: string; speed?: number }> = ({ text, className = '', speed = 20 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || prefersReducedMotion()) return;

    const container = containerRef.current;
    const textEl = textRef.current;

    const containerWidth = container.offsetWidth * 0.8;
    const textWidth = textEl.scrollWidth;

    setShouldAnimate(textWidth > containerWidth);
  }, [text]);

  if (!shouldAnimate) {
    return (
      <div ref={containerRef} className="w-full sm:w-[80%]">
        <span ref={textRef} className={`block truncate ${className}`}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full sm:w-[80%] overflow-hidden">
      <div className="inline-flex whitespace-nowrap will-change-transform">
        <span ref={textRef} className={`inline-block pr-8 ${className}`} style={{ animation: `marquee ${speed}s linear infinite` }}>
          {text}
        </span>
        <span className={`inline-block pr-8 ${className}`} style={{ animation: `marquee ${speed}s linear infinite` }}>
          {text}
        </span>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

const AnimatedTextSlider: FC<{ bullets: Array<{ icon: FC<{ className?: string }>; text: string }>; textClass: string }> = ({ bullets, textClass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentBullet = bullets[currentIndex];
  const Icon = currentBullet.icon;

  useEffect(() => {
    if (prefersReducedMotion() || !textContainerRef.current) return;

    const textEl = textContainerRef.current;
    textEl.textContent = '';

    const letters = currentBullet.text.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(10px)';
      if (char === ' ') span.style.width = '0.25em';

      return span;
    });

    letters.forEach((letter) => textEl.appendChild(letter));

    animate(letters, { opacity: [0, 1], translateY: [10, 0], duration: 600, delay: (_, i) => 100 + i * 25, easing: 'easeOutCubic' });
  }, [currentBullet.text]);

  useEffect(() => {
    if (prefersReducedMotion() || !cardRef.current) return;
    animate(cardRef.current, { scale: [0.98, 1], opacity: [0.8, 1], duration: 500, easing: 'easeOutCubic' });
  }, [currentIndex]);

  useEffect(() => {
    const slideInterval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % bullets.length), 4500);
    return () => clearInterval(slideInterval);
  }, [bullets.length]);

  return (
    <div className="relative min-h-[72px] sm:min-h-[88px] w-full">
      <div ref={cardRef} key={currentIndex} className="flex items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-muted/50 p-2.5 sm:p-3 md:p-4 border border-border/40 transition-all duration-500 ease-out">
        <Icon className={`mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 shrink-0 ${textClass}`} />
        <p ref={textContainerRef} className={`text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed flex-1 ${textClass}`} />
      </div>

      <div className="flex justify-center gap-2 sm:gap-2.5 mt-2.5 sm:mt-3 md:mt-4">
        {bullets.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 sm:w-8 md:w-10 bg-foreground/90' : 'w-1 sm:w-1.5 bg-foreground/30 hover:bg-foreground/50'}`}
            aria-label={`Ir al punto ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const ContactSection: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<ContactContent | null>(null);

  useEffect(() => {
    let mounted = true;

    fn_get_contact()
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

  const whatsappNumber = data?.meta.whatsappNumber ?? '+51987370699';
  const waDigits = whatsappNumber.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${waDigits}`;

  const salesEmail = data?.meta.salesEmail ?? 'informes@redorange.net.pe';

  const lines = useMemo<ContactLineUI[]>(() => {
    const raw = data?.lines ?? [];

    return raw.map((line) => {
      const LineIcon = ICONS[line.iconKey];
      const themeClasses = getThemeClasses(line.colorTheme);

      return {
        key: line.key,
        number: line.number,
        tabLabel: line.tabLabel,
        title: line.title,
        subtitle: line.subtitle,
        emailBodyLine: line.emailBodyLine,
        colorTheme: line.colorTheme,
        theme: { text: themeClasses.text, bg: themeClasses.bg, border: themeClasses.border, ring: themeClasses.ring },
        icon: LineIcon,
        bullets: line.bullets.map((b) => {
          const BulletIcon = BULLET_ICONS[b.iconKey];
          return { icon: BulletIcon, text: b.text };
        }),
        subjectPlaceholder: line.subjectPlaceholder,
      };
    });
  }, [data]);

  const mailtoHrefFor = (line: ContactLineUI) => {
    const subject = encodeURIComponent(`Cotización / Solicitud de información - ${line.title}`);
    const body = encodeURIComponent(`Hola Red Orange,\n\nMe gustaría solicitar una cotización sobre:\n\n- ${line.emailBodyLine}\n- Empresa/Entidad:\n- Plazo estimado:\n- Detalles:\n\nGracias.`);
    return `mailto:${salesEmail}?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (!data || lines.length === 0) return;

    if (prefersReducedMotion()) {
      const hidden = root.querySelectorAll<HTMLElement>('[data-contact="header"],[data-contact="badge"],[data-contact="chip"]');
      hidden.forEach((el) => (el.style.opacity = '1'));
      if (formRef.current) formRef.current.style.opacity = '1';
      return;
    }

    const headerEls = headerRef.current?.querySelectorAll('[data-contact="header"]') ?? [];
    const badgeEls = root.querySelectorAll('[data-contact="badge"]');
    const chipsEls = root.querySelectorAll('[data-contact="chip"]');
    const panelEl = formRef.current ? [formRef.current] : [];

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          animate(headerEls, { opacity: [0, 1], translateY: [14, 0], duration: 800, easing: 'easeOutExpo', delay: (_, i) => i * 90 });
          animate(badgeEls, { opacity: [0, 1], scale: [0.96, 1], duration: 700, easing: 'easeOutExpo', delay: 120 });
          animate(panelEl, { opacity: [0, 1], translateY: [18, 0], scale: [0.985, 1], duration: 900, easing: 'easeOutExpo', delay: 260 });
          animate(chipsEls, { opacity: [0, 1], translateY: [10, 0], duration: 700, easing: 'easeOutExpo', delay: (_, i) => 520 + i * 90 });

          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [data, lines.length]);

  if (!data || lines.length === 0) {
    return (
      <section id="contact" ref={sectionRef} className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-6 pb-12 sm:pb-16 md:pb-20 pt-8 sm:pt-12 md:pt-16 scroll-mt-20">
        <div className="relative z-10 mx-auto flex max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur">
            <p className="font-heading text-sm sm:text-base font-extrabold">Cargando contacto...</p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Preparando la información de contacto y líneas.</p>
          </div>
        </div>
      </section>
    );
  }

  const defaultLine = lines[0];

  return (
    <section id="contact" ref={sectionRef} className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 pt-8 sm:pt-12 md:pt-16 lg:pt-24 scroll-mt-20">
      <div data-contact="glow" className="pointer-events-none absolute -right-16 sm:-right-20 top-8 sm:top-12 h-[250px] sm:h-[380px] w-[250px] sm:w-[380px] rounded-full bg-primary/5 blur-3xl" />
      <div data-contact="glow" className="pointer-events-none absolute -left-16 sm:-left-20 bottom-8 sm:bottom-12 h-[250px] sm:h-[380px] w-[250px] sm:w-[380px] rounded-full bg-accent/5 blur-3xl" />

      <div ref={headerRef} className="mb-6 sm:mb-8 md:mb-10 flex flex-col gap-2 sm:gap-3">
        <div data-contact="badge" className="inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border border-border/60 bg-background/60 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur opacity-0">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="text-[10px] sm:text-xs font-semibold text-foreground">{data.header.badgeText}</span>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold opacity-0" data-contact="header">
          {data.header.title}
        </h2>

        <p className="max-w-3xl text-muted-foreground opacity-0 text-xs sm:text-sm" data-contact="header">
          {data.header.subtitle}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          {data.meta.chips.map(({ iconKey, text }) => {
            const Icon = iconKey === 'clock' ? Clock : iconKey === 'mapPin' ? MapPin : Mail;
            return (
              <span
                key={text}
                data-contact="chip"
                className="opacity-0 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-muted/60 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-muted-foreground border border-border/50"
              >
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground/70" />
                <span className="hidden sm:inline">{text}</span>
              </span>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          <a
            href={`mailto:${salesEmail}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/60 bg-background/60 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground active:scale-95"
            data-contact="chip"
          >
            <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground/70" />
            <span className="truncate max-w-[180px] sm:max-w-none">{salesEmail}</span>
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/60 bg-background/60 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground active:scale-95"
            data-contact="chip"
          >
            <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={12} height={12} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="truncate">WhatsApp {whatsappNumber}</span>
          </a>

          <span
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/60 bg-background/60 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-muted-foreground backdrop-blur"
            data-contact="chip"
          >
            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground/70" />
            <span className="truncate">{whatsappNumber}</span>
          </span>
        </div>
      </div>

      <div ref={formRef} className="opacity-0">
        <Tabs defaultValue={defaultLine.key} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl sm:rounded-2xl bg-muted/40 p-1 sm:p-1.5 border border-border/60 gap-0.5">
            {lines.map((line) => {
              const LineIcon = line.icon;
              return (
                <TabsTrigger
                  key={line.key}
                  value={line.key}
                  className="rounded-lg sm:rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm px-1.5 sm:px-2 md:px-2.5 py-2 sm:py-2.5 md:py-3.5 transition-all duration-200 hover:bg-muted/60 overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 w-full min-w-0 justify-center sm:justify-start">
                    <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-background/60 border border-border/60 shrink-0">
                      <LineIcon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${line.theme.text}`} />
                    </span>

                    <span className="hidden sm:block text-[9px] sm:text-[10px] md:text-xs font-semibold text-left leading-tight truncate">{line.tabLabel}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {lines.map((line) => {
            const LineIcon = line.icon;
            const mailtoHref = mailtoHrefFor(line);

            return (
              <TabsContent key={line.key} value={line.key} className="mt-3 sm:mt-4 md:mt-6">
                <div className={`rounded-xl sm:rounded-2xl md:rounded-3xl border border-border/70 bg-background/60 p-3.5 sm:p-4 md:p-5 lg:p-7 ring-1 ${line.theme.ring}`}>
                  <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span
                        className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold border border-border/60 ${line.theme.bg} ${line.theme.text}`}
                      >
                        <Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {line.number}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 sm:gap-1.5 sm:gap-2 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold border border-border/60 ${line.theme.bg} ${line.theme.text}`}
                      >
                        <LineIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">{line.tabLabel}</span>
                      </span>
                    </div>

                    <h3 className="font-heading text-sm sm:text-base md:text-lg lg:text-xl font-extrabold line-clamp-2 sm:line-clamp-none">{line.title}</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">{line.subtitle}</p>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-5">
                    <AnimatedTextSlider bullets={line.bullets} textClass={line.theme.text} />
                  </div>

                  <div className="mt-4 sm:mt-5 md:mt-6 grid gap-2.5 sm:gap-3 md:gap-4 sm:grid-cols-2">
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                      <label className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Nombre</label>
                      <Input placeholder="Tu nombre" className="text-xs sm:text-sm h-9 sm:h-10" />
                    </div>
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                      <label className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Correo</label>
                      <Input type="email" placeholder="tu-correo@dominio.com" className="text-xs sm:text-sm h-9 sm:h-10" />
                    </div>
                  </div>

                  <div className="mt-2.5 sm:mt-3 md:mt-4 space-y-1 sm:space-y-1.5 md:space-y-2">
                    <label className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Asunto</label>
                    <Input placeholder={line.subjectPlaceholder} className="text-xs sm:text-sm h-9 sm:h-10" />
                  </div>

                  <div className="mt-2.5 sm:mt-3 md:mt-4 space-y-1 sm:space-y-1.5 md:space-y-2">
                    <label className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Detalle</label>
                    <Textarea placeholder="Describe el alcance, plazos y cualquier información relevante." rows={4} className="text-xs sm:text-sm resize-none" />
                  </div>

                  <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col gap-2 sm:gap-2.5 md:gap-3 sm:flex-row sm:flex-wrap">
                    <Button type="button" className="font-heading group flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10" asChild>
                      <a href={mailtoHref}>
                        Enviar por correo
                        <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>

                    <Button type="button" variant="secondary" className="font-heading group flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10" asChild>
                      <a href={whatsappHref} target="_blank" rel="noreferrer">
                        WhatsApp
                        <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16} className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </a>
                    </Button>

                    <Button type="button" variant="outline" className="font-heading group flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10" asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/#services">
                        Ver servicios
                        <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </div>

                  <p className="mt-2.5 sm:mt-3 md:mt-4 text-[9px] sm:text-[11px] md:text-xs text-muted-foreground text-center sm:text-left">
                    Nota: este formulario es una maqueta visual. Si deseas, lo conectamos a correo, backend o CRM.
                  </p>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};
