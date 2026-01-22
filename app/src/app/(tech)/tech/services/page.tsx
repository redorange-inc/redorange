'use server';

import { Separator } from '@/components/ui/separator';
import { getServiceCategories } from '@/actions/tech/services/fn-get-service-categories';
import { getSupportLevels } from '@/actions/tech/services/fn-get-support-levels';
import { getTrainings } from '@/actions/tech/services/fn-get-trainings';
import { getProcesses } from '@/actions/tech/services/fn-get-processes';
import { PageWrapper } from './_components/page-wrapper';
import { HeroServices } from './_components/hero-services';
import { ServiceCategoriesSection } from './_components/service-categories-section';
import { SupportLevelsSection } from './_components/support-levels-section';
import { TrainingsSection } from './_components/trainings-section';
import { ProcessesSection } from './_components/processes-section';

const ServicesPage = async () => {
  const [categoriesResponse, supportResponse, trainingsResponse, processesResponse] = await Promise.all([getServiceCategories(), getSupportLevels(), getTrainings(), getProcesses()]);

  return (
    <PageWrapper>
      <HeroServices />

      <Separator className="my-10" />

      <ServiceCategoriesSection categories={categoriesResponse.data.items} />

      <Separator className="my-10" />

      <SupportLevelsSection supportLevels={supportResponse.data.items} />

      <Separator className="my-10" />

      <TrainingsSection trainings={trainingsResponse.data.items} />

      <Separator className="my-10" />

      <ProcessesSection processes={processesResponse.data.items} />
    </PageWrapper>
  );
};

export default ServicesPage;
