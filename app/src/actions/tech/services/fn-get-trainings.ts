'use server';

import type { ApiResponse, TrainingsResponse } from '@/app/(tech)/tech/services/_components/types';

export const getTrainings = async (): Promise<ApiResponse<TrainingsResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: TrainingsResponse = {
    items: [
      {
        title: 'Ofimática Básica',
        description: 'Uso de herramientas de productividad: procesador de textos, hojas de cálculo y presentaciones.',
        duration: '8 horas',
        level: 'básico',
        iconName: 'Monitor',
      },
      {
        title: 'Seguridad Informática',
        description: 'Buenas prácticas de seguridad, gestión de contraseñas y prevención de amenazas.',
        duration: '4 horas',
        level: 'básico',
        iconName: 'Shield',
      },
      {
        title: 'Sistemas Internos',
        description: 'Capacitación en uso de aplicaciones y sistemas institucionales.',
        duration: '6 horas',
        level: 'intermedio',
        iconName: 'Settings',
      },
      {
        title: 'Administración de Servidores',
        description: 'Gestión de servidores Linux, Docker y servicios críticos.',
        duration: '16 horas',
        level: 'avanzado',
        iconName: 'Server',
      },
      {
        title: 'Desarrollo Web',
        description: 'Fundamentos de desarrollo con React y Next.js.',
        duration: '24 horas',
        level: 'avanzado',
        iconName: 'Code2',
      },
      {
        title: 'Base de Datos',
        description: 'Consultas SQL, modelado y optimización con PostgreSQL.',
        duration: '12 horas',
        level: 'intermedio',
        iconName: 'Database',
      },
    ],
  };

  return {
    data: mockData,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'mock-database',
    },
  };
};
