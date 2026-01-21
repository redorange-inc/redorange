'use server';

import type { ApiResponse, SupportLevelsResponse } from '@/app/(tech)/tech/services/_components/types';

export const getSupportLevels = async (): Promise<ApiResponse<SupportLevelsResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: SupportLevelsResponse = {
    items: [
      {
        name: 'Soporte Básico',
        description: 'Atención para incidentes de baja criticidad y consultas generales.',
        responseTime: '< 4 horas',
        iconName: 'Clock',
        features: [
          'Atención en horario laboral',
          'Resolución de consultas básicas',
          'Acceso a base de conocimiento',
          'Seguimiento por correo',
        ],
      },
      {
        name: 'Soporte Prioritario',
        description: 'Respuesta rápida para sistemas importantes con afectación parcial.',
        responseTime: '< 2 horas',
        iconName: 'Zap',
        features: [
          'Atención extendida 7x16',
          'Escalamiento automático',
          'Canal de comunicación directo',
          'Reportes de seguimiento',
        ],
      },
      {
        name: 'Soporte Crítico',
        description: 'Atención inmediata para sistemas de misión crítica.',
        responseTime: '< 30 minutos',
        iconName: 'Shield',
        features: [
          'Disponibilidad 24/7',
          'Equipo dedicado',
          'Escalamiento a nivel gerencial',
          'Análisis post-mortem',
        ],
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
