'use server';

import { Separator } from '@/components/ui/separator';
import { getClientsData } from '@/actions/fn-clients';

import { PageWrapper } from './_components/page-wrapper';
import { HeroClients } from './_components/hero-clients';
import { CategorySection } from './_components/category-section';
import { GeneralStatsChart } from './_components/general-stats-chart';

const ClientsPage = async () => {
  const { data } = await getClientsData();

  const publicEntitiesStats = data.stats.byCategory.find((c) => c.category === 'public_entities');
  const privateEntitiesStats = data.stats.byCategory.find((c) => c.category === 'private_entities');
  const otherClientsStats = data.stats.byCategory.find((c) => c.category === 'other_clients');

  return (
    <PageWrapper>
      <HeroClients hero={data.hero} />

      <Separator className="my-10" />

      <CategorySection
        title="Entidades Públicas"
        subtitle="Gobiernos, municipalidades y entidades del Estado"
        icon="landmark"
        badgeColor="text-blue-500 bg-blue-500/10"
        clients={data.publicEntities}
        serviceBreakdown={publicEntitiesStats?.serviceBreakdown || []}
        category="public_entities"
      />

      <Separator className="my-10" />

      <CategorySection
        title="Entidades Privadas"
        subtitle="Empresas y organizaciones privadas"
        icon="briefcase"
        badgeColor="text-green-500 bg-green-500/10"
        clients={data.privateEntities}
        serviceBreakdown={privateEntitiesStats?.serviceBreakdown || []}
        category="private_entities"
      />

      <Separator className="my-10" />

      <CategorySection
        title="Otros Clientes"
        subtitle="Personas jurídicas y naturales"
        icon="users"
        badgeColor="text-violet-500 bg-violet-500/10"
        clients={data.otherClients}
        serviceBreakdown={otherClientsStats?.serviceBreakdown || []}
        naturalPersonsCount={data.stats.naturalPersonsCount}
        category="other_clients"
      />

      <Separator className="my-10" />

      <GeneralStatsChart stats={data.stats} />

      <Separator className="my-10" />
    </PageWrapper>
  );
};

export default ClientsPage;
