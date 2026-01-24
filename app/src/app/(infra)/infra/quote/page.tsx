import { Separator } from '@/components/ui/separator';
import { getQuoteData } from '@/actions/infra/quote/fn-get-quote-data';

import { PageWrapper } from './_components/page-wrapper';
import { HeroQuote } from './_components/hero-quote';
import { QuoteForm } from './_components/quote-form';
import { BenefitsSection } from './_components/benefits-section';
import { StepsSection } from './_components/steps-section';

export const metadata = {
  title: 'Cotizar',
  description: 'Solicita una cotización de equipos de cómputo, accesorios, telecomunicaciones y servicios técnicos.',
};

const QuotePage = async () => {
  const { data } = await getQuoteData();

  return (
    <PageWrapper>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
        <div data-anim="fade-up">
          <HeroQuote hero={data.hero} />
        </div>

        <section className="grid gap-8 lg:grid-cols-12 mt-8" data-anim="fade-up">
          <div className="lg:col-span-7">
            <QuoteForm categories={data.categories} purchaseTypes={data.purchaseTypes} />
          </div>
          <div className="lg:col-span-5">
            <BenefitsSection benefits={data.benefits} />
          </div>
        </section>

        <Separator className="my-10" />

        <div data-anim="fade-up">
          <StepsSection steps={data.steps} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default QuotePage;
