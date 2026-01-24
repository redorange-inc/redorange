'use server';

import { Separator } from '@/components/ui/separator';
import { getInfraHero } from '@/actions/infra/fn-get-infra-hero';
import { getInfraStats } from '@/actions/infra/fn-get-infra-stats';
import { getInfraHighlights } from '@/actions/infra/fn-get-infra-highlights';
import { getInfraProductsPreview } from '@/actions/infra/fn-get-infra-products-preview';
import { getInfraBrands } from '@/actions/infra/fn-get-infra-brands';

import { PageAnimations } from './_components/page-animations';
import { HeroSection } from './_components/hero-section';
import { OverviewCard } from './_components/overview-card';
import { ProductsCarousel } from './_components/products-carousel';
import { BrandsSection } from './_components/brands-section';

const InfraPage = async () => {
  const [heroResponse, statsResponse, highlightsResponse, productsResponse, brandsResponse] = await Promise.all([
    getInfraHero(),
    getInfraStats(),
    getInfraHighlights(),
    getInfraProductsPreview(),
    getInfraBrands(),
  ]);

  return (
    <PageAnimations>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            <HeroSection hero={heroResponse.data} highlights={highlightsResponse.data} />
          </div>
          <div className="lg:col-span-5">
            <OverviewCard stats={statsResponse.data} />
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <ProductsCarousel products={productsResponse.data} />
        </section>

        <Separator className="my-10" />

        <BrandsSection brands={brandsResponse.data} />
      </div>
    </PageAnimations>
  );
};

export default InfraPage;
