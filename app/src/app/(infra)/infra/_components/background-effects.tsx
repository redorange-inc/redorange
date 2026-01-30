'use client';

import Image from 'next/image';

export const BackgroundEffects = () => {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div data-particle className="absolute -top-24 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-(--infra-gradient-from) blur-3xl" />
      <div data-particle className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-(--infra-accent)/20 blur-3xl" />
      <div data-particle className="absolute right-[-160px] top-[240px] h-[420px] w-[420px] rounded-full bg-(--infra-gradient-via) blur-3xl" />
      <div data-particle className="absolute left-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-infra-muted blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.04),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[900px] h-[900px] opacity-[0.12] dark:opacity-[0.08]">
          <Image src="/img/infra.png" alt="" fill className="object-contain" priority />
        </div>
      </div>
    </div>
  );
};
