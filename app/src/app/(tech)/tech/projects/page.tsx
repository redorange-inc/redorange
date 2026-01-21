'use server';

import { Separator } from '@/components/ui/separator';
import { getProjects } from '@/actions/tech/projects/fn-get-projects';
import { getTechStack } from '@/actions/tech/projects/fn-get-tech-stack';
import { getFutureTech } from '@/actions/tech/projects/fn-get-future-tech';
import { PageWrapper } from './_components/page-wrapper';
import { HeroProjects } from './_components/hero-projects';
import { ProjectsSection } from './_components/projects-section';
import { TechStackSection } from './_components/tech-stack-section';
import { FutureTechSection } from './_components/future-tech-section';

const ProjectsPage = async () => {
  const [projectsResponse, techStackResponse, futureTechResponse] = await Promise.all([getProjects(), getTechStack(), getFutureTech()]);

  return (
    <PageWrapper>
      <HeroProjects />

      <Separator className="my-10" />

      <ProjectsSection projects={projectsResponse.data.items} />

      <Separator className="my-10" />

      <TechStackSection techStack={techStackResponse.data.items} />

      <Separator className="my-10" />

      <FutureTechSection futureTech={futureTechResponse.data.items} />
    </PageWrapper>
  );
};

export default ProjectsPage;
