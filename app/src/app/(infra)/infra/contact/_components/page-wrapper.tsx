'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
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
        animate(el, {
          opacity: [0, 1],
          transform: ['translateY(24px) scale(0.98)', 'translateY(0px) scale(1)'],
          duration: 800,
          easing: 'easeOutExpo',
          delay: 100 + 80 * idx,
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-background pt-20">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">{children}</div>
    </main>
  );
};
