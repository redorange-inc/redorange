import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
      {/* Hero Skeleton */}
      <section className="py-12 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex justify-center gap-2">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="h-14 w-80 mx-auto" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Form + Benefits Skeleton */}
      <section className="grid gap-8 lg:grid-cols-12 mt-8">
        <div className="lg:col-span-7">
          <Card className="border-infra/20">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-11 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-6 w-48" />
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-infra/20">
              <CardContent className="p-4 flex gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Steps Skeleton */}
      <section className="py-8">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
