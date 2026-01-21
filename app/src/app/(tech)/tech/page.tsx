'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Separator } from '@/components/ui/separator';
import { BackgroundEffects } from './_components/background-effects';
import { HeroSection } from './_components/hero-section';
import { OverviewCard } from './_components/overview-card';
import { ServicesCarousel } from './_components/services-carousel';
import { ImpactChart } from './_components/impact-chart';
import { TrendChart } from './_components/trend-chart';
import { AchievementsSection } from './_components/achievements-section';
import { CtaSection } from './_components/cta-section';

const TechPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="fade-up"]'));
      elements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px) scale(0.98)';
      });

      elements.forEach((el, idx) => {
        animate(el, { opacity: [0, 1], transform: ['translateY(24px) scale(0.98)', 'translateY(0px) scale(1)'], duration: 800, easing: 'easeOutExpo', delay: 100 + 80 * idx });
      });

      const particles = document.querySelectorAll<HTMLElement>('[data-particle]');
      particles.forEach((particle, idx) => {
        animate(particle, { translateY: [0, -15, 0], translateX: [0, idx % 2 === 0 ? 8 : -8, 0], opacity: [0.3, 0.6, 0.3], duration: 4000 + idx * 500, easing: 'easeInOutSine', loop: true, delay: idx * 200 });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-background pt-20">
      <BackgroundEffects />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            <HeroSection />
          </div>
          <div className="lg:col-span-5">
            <OverviewCard />
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <ServicesCarousel />
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-12" data-anim="fade-up">
          <ImpactChart />
          <TrendChart />
        </section>

        <Separator className="my-10" />

        <AchievementsSection />

        <Separator className="my-10" />

        <CtaSection />
      </div>
    </main>
  );
};

export default TechPage;
