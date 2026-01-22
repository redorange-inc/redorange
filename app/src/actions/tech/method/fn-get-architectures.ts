'use server';

import type { ApiResponse, ArchitecturesResponse } from '@/app/(tech)/tech/method/_components/types';

export const getArchitectures = async (): Promise<ApiResponse<ArchitecturesResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ArchitecturesResponse = {
    items: [
      {
        name: 'Arquitectura Hexagonal',
        description: 'Aislamiento del dominio de negocio mediante puertos y adaptadores, permitiendo independencia de frameworks y bases de datos.',
        iconName: 'Boxes',
        features: [
          'Dominio aislado e independiente',
          'Puertos de entrada y salida',
          'Adaptadores intercambiables',
          'Testing simplificado',
          'Bajo acoplamiento',
        ],
      },
      {
        name: 'Screaming Architecture',
        description: 'La estructura del proyecto comunica claramente el propósito del sistema, organizando el código por casos de uso y dominio.',
        iconName: 'Layers',
        features: [
          'Estructura orientada al dominio',
          'Casos de uso evidentes',
          'Navegación intuitiva',
          'Independencia de frameworks',
          'Mantenibilidad mejorada',
        ],
      },
      {
        name: 'Clean Architecture',
        description: 'Capas concéntricas que protegen la lógica de negocio, con dependencias apuntando hacia el centro.',
        iconName: 'Shield',
        features: [
          'Entidades y casos de uso centrales',
          'Interfaces como contratos',
          'Frameworks en capas externas',
          'Testabilidad garantizada',
          'Escalabilidad sostenible',
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
