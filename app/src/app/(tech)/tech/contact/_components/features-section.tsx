'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { ui } from './constants';

interface Feature {
  title: string;
  description: string;
  iconName: IconName;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    if (animationStarted.current || !cardsRef.current) return;
    animationStarted.current = true;

    const cards = cardsRef.current.querySelectorAll('[data-feature-card]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card, idx) => {
              const el = card as HTMLElement;
              el.style.opacity = '0';
              el.style.transform = 'translateY(20px) scale(0.95)';

              animate(el, { opacity: [0, 1], translateY: [20, 0], scale: [0.95, 1], duration: 700, easing: 'easeOutBack', delay: 100 + idx * 120 });
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section data-anim="fade-up">
      <h2 className="text-xl font-bold text-foreground mb-4">¿Por qué contactarnos?</h2>

      <div ref={cardsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => (
          <Card key={idx} data-feature-card className={`rounded-2xl ${ui.glassCard} ${ui.hoverLift} group`} style={{ opacity: 0 }}>
            <CardContent className="p-5 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-tech/20 flex items-center justify-center text-tech group-hover:scale-110 transition-transform">
                <DynamicIcon name={feature.iconName} size={24} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
