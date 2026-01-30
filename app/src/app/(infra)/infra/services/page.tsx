import { Separator } from '@/components/ui/separator';
import { getServicesData } from '@/actions/infra/services/fn-get-services-data';

import { PageWrapper } from './_components/page-wrapper';
import { HeroServices } from './_components/hero-services';
import { ServicesGrid } from './_components/services-grid';
import { ProcessSection } from './_components/process-section';
import { FAQSection } from './_components/faq-section';

const ServicesPage = async () => {
  const { data } = await getServicesData();

  return (
    <PageWrapper>
      <HeroServices hero={data.hero} />

      <Separator className="my-10" />

      <ServicesGrid services={data.services} />

      <Separator className="my-10" />

      <ProcessSection process={data.process} />

      <Separator className="my-10" />

      <FAQSection faqs={data.faqs} />
    </PageWrapper>
  );
};

export default ServicesPage;
