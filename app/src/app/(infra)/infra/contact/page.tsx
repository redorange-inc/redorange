import { Separator } from '@/components/ui/separator';
import { getInfraContactData } from '@/actions/infra/contact/fn-get-infra-contact-data';

import { HeroContact } from './_components/hero-contact';
import { ContactForm } from './_components/contact-form';
import { ContactInfoSection } from './_components/contact-info-section';
import { FeaturesSection } from './_components/features-section';
import { QuickContact } from './_components/quick-contact';

export const metadata = {
  title: 'Contacto',
  description: 'Contáctanos para cotizar equipos tecnológicos, importación y servicios técnicos.',
};

const InfraContactPage = async () => {
  const { data } = await getInfraContactData();

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 lg:px-6">
      <div data-anim="fade-up">
        <HeroContact hero={data.hero} />
      </div>

      <section className="grid gap-8 lg:grid-cols-12 mt-8" data-anim="fade-up">
        <div className="lg:col-span-7">
          <ContactForm formFields={data.formFields} services={data.services} contactInfo={data.info} />
        </div>
        <div className="lg:col-span-5">
          <ContactInfoSection info={data.info} />
        </div>
      </section>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <FeaturesSection features={data.features} />
      </div>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <QuickContact info={data.info} />
      </div>
    </div>
  );
};

export default InfraContactPage;
