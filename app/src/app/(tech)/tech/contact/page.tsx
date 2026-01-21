'use server';

import { Separator } from '@/components/ui/separator';
import { getContactData } from '@/actions/tech/contact/fn-get-contact-data';
import { PageWrapper } from './_components/page-wrapper';
import { HeroContact } from './_components/hero-contact';
import { ContactInfoSection } from './_components/contact-info-section';
import { ContactForm } from './_components/contact-form';
import { FeaturesSection } from './_components/features-section';
import { QuickContact } from './_components/quick-contact';

const ContactPage = async () => {
  const contactResponse = await getContactData();
  const { hero, info, services, features } = contactResponse.data;

  return (
    <PageWrapper>
      <HeroContact badge={hero.badge} title={hero.title} subtitle={hero.subtitle} description={hero.description} />

      <Separator className="my-10" />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7" data-anim="fade-up">
          <ContactForm services={services} info={info} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ContactInfoSection info={info} />
        </div>
      </div>

      <Separator className="my-10" />

      <FeaturesSection features={features} />

      <Separator className="my-10" />

      <QuickContact info={info} />
    </PageWrapper>
  );
};

export default ContactPage;
