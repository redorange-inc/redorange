'use server';

import { Separator } from '@/components/ui/separator';
import { getInfraHero } from '@/actions/infra/fn-get-infra-hero';
import { getInfraStats } from '@/actions/infra/fn-get-infra-stats';
import { getInfraHighlights } from '@/actions/infra/fn-get-infra-highlights';
import { getInfraProductsPreview } from '@/actions/infra/fn-get-infra-products-preview';
import { getInfraImpactData } from '@/actions/infra/fn-get-infra-impact';
import { getInfraAchievements } from '@/actions/infra/fn-get-infra-achievements';
import { getInfraBrands } from '@/actions/infra/fn-get-infra-brands';

import { PageAnimations } from './_components/page-animations';
import { BackgroundEffects } from './_components/background-effects';
import { HeroSection } from './_components/hero-section';
import { OverviewCard } from './_components/overview-card';
import { ProductsCarousel } from './_components/products-carousel';
import { ImpactChart } from './_components/impact-chart';
import { AchievementsSection } from './_components/achievements-section';
import { BrandsSection } from './_components/brands-section';

const InfraPage = async () => {
  const [
    heroResponse,
    statsResponse,
    highlightsResponse,
    productsResponse,
    impactResponse,
    achievementsResponse,
    brandsResponse,
  ] = await Promise.all([
    getInfraHero(),
    getInfraStats(),
    getInfraHighlights(),
    getInfraProductsPreview(),
    getInfraImpactData(),
    getInfraAchievements(),
    getInfraBrands(),
  ]);

  return (
    <PageAnimations>
      <BackgroundEffects />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        {/* Hero + Overview */}
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            <HeroSection hero={heroResponse.data} highlights={highlightsResponse.data} />
          </div>
          <div className="lg:col-span-5">
            <OverviewCard stats={statsResponse.data} />
          </div>
        </section>

        <Separator className="my-10" />

        {/* Products Carousel */}
        <section data-anim="fade-up">
          <ProductsCarousel products={productsResponse.data} />
        </section>

        <Separator className="my-10" />

        {/* Impact Chart */}
        <section className="max-w-xl mx-auto" data-anim="fade-up">
          <ImpactChart impactData={impactResponse.data} />
        </section>

        <Separator className="my-10" />

        {/* Achievements */}
        <AchievementsSection achievements={achievementsResponse.data} />

        <Separator className="my-10" />

        {/* Brands */}
        <BrandsSection brands={brandsResponse.data} />
      </div>
    </PageAnimations>
  );
};

export default InfraPage;
