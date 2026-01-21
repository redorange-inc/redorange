'use server';

import { Separator } from '@/components/ui/separator';
import { getStats } from '@/actions/tech/fn-get-stats';
import { getImpactData } from '@/actions/tech/fn-get-impact-data';
import { getTimeSeries } from '@/actions/tech/fn-get-time-series';
import { getServices } from '@/actions/tech/fn-get-services';
import { getAchievements } from '@/actions/tech/fn-get-achievements';
import { getHighlights } from '@/actions/tech/fn-get-highlights';

import { PageAnimations } from './_components/page-animations';
import { BackgroundEffects } from './_components/background-effects';
import { HeroSection } from './_components/hero-section';
import { OverviewCard } from './_components/overview-card';
import { ServicesCarousel } from './_components/services-carousel';
import { ImpactChart } from './_components/impact-chart';
import { TrendChart } from './_components/trend-chart';
import { AchievementsSection } from './_components/achievements-section';
import { CtaSection } from './_components/cta-section';

const TechPage = async () => {
  const [statsResponse, impactResponse, timeSeriesResponse, servicesResponse, achievementsResponse, highlightsResponse] = await Promise.all([
    getStats(),
    getImpactData(),
    getTimeSeries(),
    getServices(),
    getAchievements(),
    getHighlights(),
  ]);

  return (
    <PageAnimations>
      <BackgroundEffects />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
          <div className="lg:col-span-7">
            <HeroSection highlights={highlightsResponse.data.items} />
          </div>
          <div className="lg:col-span-5">
            <OverviewCard stats={statsResponse.data} />
          </div>
        </section>

        <Separator className="my-10" />

        <section data-anim="fade-up">
          <ServicesCarousel services={servicesResponse.data.items} />
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-12" data-anim="fade-up">
          <ImpactChart impactData={impactResponse.data.items} />
          <TrendChart timeSeriesData={timeSeriesResponse.data.items} />
        </section>

        <Separator className="my-10" />

        <AchievementsSection achievements={achievementsResponse.data.items} />

        <Separator className="my-10" />

        <CtaSection />
      </div>
    </PageAnimations>
  );
};

export default TechPage;
