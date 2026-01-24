'use client';

import { useEffect, type ReactNode } from 'react';

interface PageAnimationsProps {
  children: ReactNode;
}

export const PageAnimations = ({ children }: PageAnimationsProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in', 'fade-in', 'slide-in-from-bottom-4');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    const elements = document.querySelectorAll('[data-anim]');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};
