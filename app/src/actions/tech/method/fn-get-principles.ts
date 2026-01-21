'use server';

import type { ApiResponse, PrinciplesResponse } from '@/app/(tech)/tech/method/_components/types';

export const getPrinciples = async (): Promise<ApiResponse<PrinciplesResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: PrinciplesResponse = {
    items: [
      {
        acronym: 'S',
        name: 'Single Responsibility',
        description: 'Cada módulo o clase debe tener una única razón para cambiar.',
        iconName: 'Target',
      },
      {
        acronym: 'O',
        name: 'Open/Closed',
        description: 'Abierto para extensión, cerrado para modificación.',
        iconName: 'Puzzle',
      },
      {
        acronym: 'L',
        name: 'Liskov Substitution',
        description: 'Los objetos derivados deben poder sustituir a sus tipos base.',
        iconName: 'Layers',
      },
      {
        acronym: 'I',
        name: 'Interface Segregation',
        description: 'Interfaces específicas son mejores que una interfaz general.',
        iconName: 'Boxes',
      },
      {
        acronym: 'D',
        name: 'Dependency Inversion',
        description: 'Depender de abstracciones, no de implementaciones concretas.',
        iconName: 'GitBranch',
      },
      {
        acronym: 'KISS',
        name: 'Keep It Simple, Stupid',
        description: 'La simplicidad debe ser un objetivo clave del diseño.',
        iconName: 'Zap',
      },
      {
        acronym: 'DRY',
        name: "Don't Repeat Yourself",
        description: 'Evitar la duplicación de lógica mediante abstracción.',
        iconName: 'RefreshCw',
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
