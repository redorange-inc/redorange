import { Separator } from '@/components/ui/separator';
import { getInfraContactData } from '@/actions/infra/contact/fn-get-infra-contact-data';

import { PageWrapper } from './_components/page-wrapper';
import { HeroContact } from './_components/hero-contact';
import { ContactForm } from './_components/contact-form';
import { ContactInfoSection } from './_components/contact-info-section';
import { FeaturesSection } from './_components/features-section';

const InfraContactPage = async () => {
  const { data } = await getInfraContactData();

  return (
    <PageWrapper>
      <HeroContact hero={data.hero} />

      <section className="grid gap-8 lg:grid-cols-12" data-anim="fade-up">
        <div className="lg:col-span-7">
          <ContactForm formFields={data.formFields} services={data.services} contactInfo={data.info} />
        </div>
        <div className="lg:col-span-5">
          <ContactInfoSection info={data.info} />
        </div>
      </section>

      <Separator className="my-10" />

      <FeaturesSection features={data.features} />
    </PageWrapper>
  );
};

export default InfraContactPage;
