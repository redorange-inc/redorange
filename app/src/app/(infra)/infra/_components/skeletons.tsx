'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const HeroSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full max-w-md" />
        <Skeleton className="h-12 w-3/4 max-w-sm" />
        <Skeleton className="h-16 w-full max-w-xl" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-11 w-36" />
        <Skeleton className="h-11 w-32" />
      </div>
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-40 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export const OverviewCardSkeleton = () => {
  return (
    <Card className="h-full border-infra/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-6 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-infra/10 p-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
};

export const ProductsCarouselSkeleton = () => {
  return (
    <div className="space-y-4">
      <Card className="border-none bg-linear-to-br from-infra/5 via-transparent to-transparent">
        <CardContent className="flex items-center gap-4 p-6">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export const ChartsSkeleton = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <Card className="lg:col-span-5 border-infra/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-7 border-infra/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
          <div className="flex justify-center gap-6 mt-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AchievementsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-infra/20">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-16 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const BrandsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-56 mx-auto" />
        <Skeleton className="h-4 w-72 mx-auto" />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-14 w-[100px] rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export const CtaSkeleton = () => {
  return (
    <Card className="border-infra/20">
      <CardContent className="p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-16 w-full max-w-lg" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-11 w-48" />
            <Skeleton className="h-11 w-44" />
          </div>
        </div>
        <div className="flex justify-center gap-6 pt-6 mt-6 border-t border-infra/10">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-5 w-32" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
