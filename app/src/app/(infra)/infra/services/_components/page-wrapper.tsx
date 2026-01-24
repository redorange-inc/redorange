'use client';

import { useEffect, type ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
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

  return (
    <>
      {/* <div className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20" style={{ backgroundImage: 'url(/img/infra.png)' }} /> */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-background/80 via-background/60 to-background/90" />
      {children}
    </>
  );
};
