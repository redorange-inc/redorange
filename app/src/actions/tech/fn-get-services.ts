'use server';

import type { ApiResponse, ServiceItemResponse } from '@/app/(tech)/tech/_components/types';

export const getServices = async (): Promise<ApiResponse<ServiceItemResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ServiceItemResponse = {
    items: [
      { text: 'Consultoría y asesoría en informática y cómputo', iconName: 'CodeXml' },
      { text: 'Desarrollo de software, sistemas y aplicaciones', iconName: 'Database' },
      { text: 'Programación y construcción de sistemas informáticos', iconName: 'Server' },
      { text: 'Administración y mantenimiento de sistemas, servidores y aplicaciones', iconName: 'Settings' },
      { text: 'Gestión de redes, bases de datos, mejora de procesos y capacitación', iconName: 'Activity' },
      { text: 'Monitoreo, disponibilidad y continuidad operativa', iconName: 'ShieldCheck' },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'mock-database' },
    message: 'Services retrieved successfully',
  };
};
