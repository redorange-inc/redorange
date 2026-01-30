'use server';

import { Separator } from '@/components/ui/separator';
import { getNetworksData } from '@/actions/infra/networks/fn-get-networks-data';

import { PageWrapper } from './_components/page-wrapper';
import { HeroNetworks } from './_components/hero-networks';
import { NetworkServicesGrid } from './_components/network-services-grid';
import { NetworkBenefits } from './_components/network-benefits';
import { ProjectsSection } from './_components/projects-section';
import { TechnologiesSection } from './_components/technologies-section';

const NetworksPage = async () => {
  const { data } = await getNetworksData();

  return (
    <PageWrapper>
      <HeroNetworks hero={data.hero} />

      <Separator className="my-10" />

      <NetworkServicesGrid services={data.services} />

      <Separator className="my-10" />

      <NetworkBenefits benefits={data.benefits} />

      <Separator className="my-10" />

      <ProjectsSection projects={data.projects} />

      <Separator className="my-10" />

      <TechnologiesSection technologies={data.technologies} />
    </PageWrapper>
  );
};

export default NetworksPage;
