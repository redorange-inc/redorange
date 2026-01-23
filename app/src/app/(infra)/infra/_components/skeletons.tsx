'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const HeroSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-full max-w-lg" />
        <Skeleton className="h-12 w-3/4 max-w-md" />
        <Skeleton className="h-20 w-full max-w-xl" />
      </div>
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-40 rounded-full" />
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  );
};

export const OverviewCardSkeleton = () => {
  return (
    <Card className="h-full border-infra/20">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-infra/10 p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-12" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const ProductsCarouselSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="min-w-[300px] max-w-[300px] border-infra/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-40 mt-3" />
              <Skeleton className="h-10 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-5 w-20 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ServicesSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-infra/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-5 w-36" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <div className="space-y-1.5">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
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
        <Skeleton className="h-5 w-72 mx-auto" />
      </div>
      <div className="flex gap-8 overflow-hidden py-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-16 min-w-[120px] rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export const CtaSkeleton = () => {
  return (
    <Card className="border-infra/20">
      <CardContent className="p-8 lg:p-12">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="space-y-3 w-full">
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-40" />
          </div>
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-5 w-32" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
