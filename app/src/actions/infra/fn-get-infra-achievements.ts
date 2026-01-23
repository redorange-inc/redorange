'use server';

import type { ApiResponse, AchievementsData } from '@/app/(infra)/infra/_components/types';

export const getInfraAchievements = async (): Promise<ApiResponse<AchievementsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: AchievementsData = {
    title: 'Logros destacados',
    items: [
      {
        title: 'Tiempo de entrega',
        subtitle: 'Promedio nacional',
        value: '< 72h',
        iconName: 'clock',
      },
      {
        title: 'Marcas aliadas',
        subtitle: 'Fabricantes directos',
        value: '25+',
        iconName: 'award',
      },
      {
        title: 'Satisfacción',
        subtitle: 'Clientes satisfechos',
        value: '98%',
        iconName: 'thumbsUp',
      },
    ],
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
