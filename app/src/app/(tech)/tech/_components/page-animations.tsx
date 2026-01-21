'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface PageAnimationsProps {
  children: React.ReactNode;
}

export const PageAnimations = ({ children }: PageAnimationsProps) => {
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
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background pt-20">
      {children}
    </div>
  );
};
