'use server';

import { Separator } from '@/components/ui/separator';
import { getMethodologies } from '@/actions/tech/method/fn-get-methodologies';
import { getPrinciples } from '@/actions/tech/method/fn-get-principles';
import { getArchitectures } from '@/actions/tech/method/fn-get-architectures';
import { getWorkflow } from '@/actions/tech/method/fn-get-workflow';
import { PageWrapper } from './_components/page-wrapper';
import { HeroMethod } from './_components/hero-method';
import { MethodologySection } from './_components/methodology-section';
import { PrinciplesSection } from './_components/principles-section';
import { ArchitecturesSection } from './_components/architectures-section';
import { WorkflowSection } from './_components/workflow-section';

const MethodPage = async () => {
  const [methodologiesResponse, principlesResponse, architecturesResponse, workflowResponse] = await Promise.all([getMethodologies(), getPrinciples(), getArchitectures(), getWorkflow()]);

  return (
    <PageWrapper>
      <HeroMethod />

      <Separator className="my-10" />

      <MethodologySection methodologies={methodologiesResponse.data.items} />

      <Separator className="my-10" />

      <PrinciplesSection principles={principlesResponse.data.items} />

      <Separator className="my-10" />

      <ArchitecturesSection architectures={architecturesResponse.data.items} />

      <Separator className="my-10" />

      <WorkflowSection workflow={workflowResponse.data.items} />
    </PageWrapper>
  );
};

export default MethodPage;
