import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
  return (
    <main className="relative min-h-screen bg-background pt-20">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="mb-10">
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-16 w-full max-w-3xl" />
        </section>

        <section className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border-border/40">
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
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="rounded-2xl border-border/40">
                  <CardContent className="p-4 flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator className="my-10" />

        <section>
          <div className="mb-6 text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
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
    </main>
  );
}
