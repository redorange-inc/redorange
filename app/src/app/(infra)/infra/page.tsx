'use server';

import { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import { getInfraStats } from '@/actions/infra/fn-get-infra-stats';
import { getInfraHighlights } from '@/actions/infra/fn-get-infra-highlights';
import { getInfraProducts } from '@/actions/infra/fn-get-infra-products';
import { getInfraTechnicalServices } from '@/actions/infra/fn-get-infra-services';
import { getInfraBrands } from '@/actions/infra/fn-get-infra-brands';

import { PageAnimations } from './_components/page-animations';
import { BackgroundEffects } from './_components/background-effects';
import { HeroSection } from './_components/hero-section';
import { OverviewCard } from './_components/overview-card';
import { ProductsCarousel } from './_components/products-carousel';
import { TechnicalServicesSection } from './_components/technical-services-section';
import { BrandsSection } from './_components/brands-section';
import { CtaSection } from './_components/cta-section';
import { HeroSkeleton, OverviewCardSkeleton, ProductsCarouselSkeleton, ServicesSkeleton, BrandsSkeleton, CtaSkeleton } from './_components/skeletons';

const InfraPage = async () => {
  const [statsResponse, highlightsResponse, productsResponse, servicesResponse, brandsResponse] = await Promise.all([
    getInfraStats(),
    getInfraHighlights(),
    getInfraProducts(),
    getInfraTechnicalServices(),
    getInfraBrands(),
  ]);

  return (
    <PageAnimations>
      <BackgroundEffects />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            <Suspense fallback={<HeroSkeleton />}>
              <HeroSection highlights={highlightsResponse.data.items} />
            </Suspense>
          </div>
          <div className="lg:col-span-5">
            <Suspense fallback={<OverviewCardSkeleton />}>
              <OverviewCard stats={statsResponse.data} />
            </Suspense>
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <Suspense fallback={<ProductsCarouselSkeleton />}>
            <ProductsCarousel products={productsResponse.data} />
          </Suspense>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <Suspense fallback={<ServicesSkeleton />}>
            <TechnicalServicesSection services={servicesResponse.data} />
          </Suspense>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <Suspense fallback={<BrandsSkeleton />}>
            <BrandsSection brands={brandsResponse.data} />
          </Suspense>
        </section>

        <Separator className="my-10" />

        <Suspense fallback={<CtaSkeleton />}>
          <CtaSection />
        </Suspense>
      </div>
    </PageAnimations>
  );
};

export default InfraPage;
