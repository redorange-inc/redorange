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
      const fadeUpElements = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="fade-up"]'));
      fadeUpElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px) scale(0.98)';
      });

      fadeUpElements.forEach((el, idx) => {
        animate(el, { opacity: [0, 1], transform: ['translateY(24px) scale(0.98)', 'translateY(0px) scale(1)'], duration: 800, easing: 'easeOutExpo', delay: 100 + 80 * idx });
      });

      const scaleElements = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="scale-in"]'));
      scaleElements.forEach((el, idx) => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.9)';
        animate(el, { opacity: [0, 1], scale: [0.9, 1], duration: 600, easing: 'easeOutBack', delay: 300 + 100 * idx });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-background pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-tech/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-tech-accent/10 blur-3xl" />
        <div className="absolute right-[-160px] top-[240px] h-[420px] w-[420px] rounded-full bg-tech/5 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">{children}</div>
    </main>
  );
};
