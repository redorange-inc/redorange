import { Separator } from '@/components/ui/separator';
import { HeroSkeleton, OverviewCardSkeleton, ProductsCarouselSkeleton, ServicesSkeleton, BrandsSkeleton, CtaSkeleton } from './_components/skeletons';

export default function Loading() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <HeroSkeleton />
        </div>
        <div className="lg:col-span-5">
          <OverviewCardSkeleton />
        </div>
      </section>

      <Separator className="my-10" />

      <section>
        <ProductsCarouselSkeleton />
      </section>

      <Separator className="my-10" />

      <section>
        <ServicesSkeleton />
      </section>

      <Separator className="my-10" />

      <section>
        <BrandsSkeleton />
      </section>

      <Separator className="my-10" />

      <CtaSkeleton />
    </div>
  );
}
