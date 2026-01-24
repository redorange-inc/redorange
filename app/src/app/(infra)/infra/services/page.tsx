import { Separator } from '@/components/ui/separator';
import { getServicesData } from '@/actions/infra/services/fn-get-services-data';

import { PageWrapper } from './_components/page-wrapper';
import { HeroServices } from './_components/hero-services';
import { BenefitsStats } from './_components/benefits-stats';
import { ServicesGrid } from './_components/services-grid';
import { ProcessSection } from './_components/process-section';
import { FAQSection } from './_components/faq-section';
import { ContactCTA } from './_components/contact-cta';

export const metadata = {
  title: 'Servicios Técnicos',
  description: 'Reparación, mantenimiento y soporte técnico para equipos de cómputo y telecomunicaciones.',
};

const ServicesPage = async () => {
  const { data } = await getServicesData();

  return (
    <PageWrapper>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
        {/* Hero */}
        <div data-anim="fade-up">
          <HeroServices hero={data.hero} />
        </div>

        {/* Benefits Stats */}
        <div data-anim="fade-up" className="mt-8">
          <BenefitsStats benefits={data.benefits} />
        </div>

        <Separator className="my-10" />

        {/* Services Grid */}
        <div data-anim="fade-up">
          <ServicesGrid services={data.services} />
        </div>

        <Separator className="my-10" />

        {/* Process */}
        <div data-anim="fade-up">
          <ProcessSection process={data.process} />
        </div>

        <Separator className="my-10" />

        {/* FAQs */}
        <div data-anim="fade-up">
          <FAQSection faqs={data.faqs} />
        </div>

        <Separator className="my-10" />

        {/* Contact CTA */}
        <div data-anim="fade-up">
          <ContactCTA phone={data.contactPhone} whatsapp={data.contactWhatsapp} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ServicesPage;
