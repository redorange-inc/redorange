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
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-6 w-44 rounded-full" />
          </div>
          <Skeleton className="h-14 w-80 mx-auto" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>
      </section>

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
                <Skeleton className="h-10 w-full" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Benefits */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-infra/20">
              <CardContent className="p-5 text-center">
                <Skeleton className="h-12 w-12 rounded-xl mx-auto mb-3" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Projects */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-infra/20">
              <CardContent className="p-5">
                <Skeleton className="h-6 w-20 rounded-full mb-3" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-20 mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Technologies */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-56 mx-auto" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-14 w-[140px] rounded-lg shrink-0" />
          ))}
        </div>
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
            <Skeleton className="h-10 w-44" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
