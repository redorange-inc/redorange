import { Separator } from '@/components/ui/separator';
import { getNetworksData } from '@/actions/infra/networks/fn-get-networks-data';

import { HeroNetworks } from './_components/hero-networks';
import { NetworkServicesGrid } from './_components/network-services-grid';
import { NetworkBenefits } from './_components/network-benefits';
import { ProjectsSection } from './_components/projects-section';
import { TechnologiesSection } from './_components/technologies-section';
import { ContactCTA } from './_components/contact-cta';

export const metadata = {
  title: 'Redes',
  description: 'Diseño, instalación y mantenimiento de redes empresariales. Cableado estructurado y conectividad.',
};

const NetworksPage = async () => {
  const { data } = await getNetworksData();

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
      <div data-anim="fade-up">
        <HeroNetworks hero={data.hero} />
      </div>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <NetworkServicesGrid services={data.services} />
      </div>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <NetworkBenefits benefits={data.benefits} />
      </div>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <ProjectsSection projects={data.projects} />
      </div>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <TechnologiesSection technologies={data.technologies} />
      </div>

      <Separator className="my-10" />

      <div data-anim="fade-up">
        <ContactCTA phone={data.contactPhone} whatsapp={data.contactWhatsapp} />
      </div>
    </div>
  );
};

export default NetworksPage;
