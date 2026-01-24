import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
      {/* Hero */}
      <section className="py-12 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex justify-center gap-2">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-6 w-44 rounded-full" />
          </div>
          <Skeleton className="h-14 w-96 mx-auto" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Benefits Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mt-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-infra/20">
            <CardContent className="pt-6 pb-4 text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
              <Skeleton className="h-8 w-20 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-10" />

      {/* Services Grid */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-infra/20">
              <CardHeader className="pb-3">
                <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Process */}
      <section className="py-8">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-36 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* FAQs */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-52" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </section>

      <Separator className="my-10" />

      {/* CTA */}
      <Card className="border-infra/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
