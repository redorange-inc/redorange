import type { FC } from 'react';
import type { Metadata } from 'next';
import { fn_get_team } from '@/actions/fn-teams';
import { TeamGrid } from './_components/team-grid';

export const metadata: Metadata = {
  title: 'Nuestro Equipo | Red Orange',
  description: 'Conoce al equipo de profesionales de Red Orange. Expertos en tecnología, transformación digital, gestión pública y desarrollo de software comprometidos con la excelencia.',
  openGraph: {
    title: 'Nuestro Equipo | Red Orange',
    description: 'Profesionales apasionados por la tecnología y comprometidos con la excelencia.',
    type: 'website',
  },
};

const TeamPage: FC = async () => {
  const members = await fn_get_team();

  return <TeamGrid members={members} />;
};

export default TeamPage;
