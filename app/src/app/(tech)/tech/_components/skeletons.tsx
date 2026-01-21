'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const SkeletonPulse = ({ className = '', ...props }: SkeletonProps) => <div className={`animate-pulse rounded-xl bg-muted ${className}`} {...props} />;

export const SkeletonStatCard = () => (
  <div className="rounded-2xl border border-border/60 bg-background/40 p-3 backdrop-blur">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-10 w-10 rounded-xl" />
      <div className="text-right space-y-2">
        <SkeletonPulse className="h-6 w-16 ml-auto" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonAchievementCard = () => (
  <Card className="rounded-3xl border-border/40 bg-background/40 backdrop-blur">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-10 w-10 rounded-2xl" />
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-3 w-20" />
          </div>
        </div>
        <SkeletonPulse className="h-9 w-16 rounded-2xl" />
      </div>
    </CardContent>
  </Card>
);

export const SkeletonChart = () => (
  <div className="h-[300px] w-full p-4">
    <div className="flex h-full items-end justify-between gap-3">
      {[65, 85, 45, 90, 70, 55].map((height, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <SkeletonPulse className="w-full rounded-t-lg" style={{ height: `${height}%` }} />
          <SkeletonPulse className="h-3 w-12" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonHeroSection = () => (
  <div className="space-y-4">
    <div className="flex gap-2">
      <SkeletonPulse className="h-6 w-48 rounded-full" />
      <SkeletonPulse className="h-6 w-32 rounded-full" />
    </div>
    <SkeletonPulse className="h-12 w-full max-w-lg" />
    <SkeletonPulse className="h-12 w-3/4" />
    <SkeletonPulse className="h-5 w-full max-w-xl" />
    <div className="flex gap-3 mt-6">
      <SkeletonPulse className="h-10 w-32 rounded-lg" />
      <SkeletonPulse className="h-10 w-28 rounded-lg" />
    </div>
    <div className="grid gap-3 sm:grid-cols-3 mt-7">
      {[1, 2, 3].map((i) => (
        <SkeletonPulse key={i} className="h-20 rounded-2xl" />
      ))}
    </div>
  </div>
);

export const SkeletonServiceCarousel = () => (
  <div className="rounded-2xl border border-border/50 bg-background/40 p-4 backdrop-blur">
    <div className="flex items-start gap-3">
      <SkeletonPulse className="h-10 w-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-5 w-full" />
        <SkeletonPulse className="h-5 w-3/4" />
      </div>
    </div>
  </div>
);

export const SkeletonCtaSection = () => (
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div className="max-w-2xl space-y-3">
      <SkeletonPulse className="h-7 w-80" />
      <SkeletonPulse className="h-4 w-full max-w-lg" />
      <div className="flex gap-2 mt-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonPulse key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </div>
    <div className="flex gap-3">
      <SkeletonPulse className="h-12 w-40 rounded-lg" />
      <SkeletonPulse className="h-12 w-36 rounded-lg" />
    </div>
  </div>
);
