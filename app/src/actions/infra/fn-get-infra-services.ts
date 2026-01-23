'use server';

import type { ApiResponse, TechnicalServicesData } from '@/app/(infra)/infra/_components/types';

export const getInfraTechnicalServices = async (): Promise<ApiResponse<TechnicalServicesData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: TechnicalServicesData = {
    items: [
      {
        id: 'repair',
        title: 'Reparación de Equipos',
        description: 'Diagnóstico y reparación de computadoras, laptops y periféricos',
        iconName: 'wrench',
        features: ['Diagnóstico gratuito', 'Repuestos originales', 'Garantía de servicio', 'Entrega a domicilio'],
      },
      {
        id: 'maintenance',
        title: 'Mantenimiento Preventivo',
        description: 'Planes de mantenimiento para prolongar la vida útil de tus equipos',
        iconName: 'settings',
        features: ['Limpieza profesional', 'Actualización de software', 'Optimización de rendimiento', 'Revisión periódica'],
      },
      {
        id: 'installation',
        title: 'Instalación de Equipos',
        description: 'Configuración e instalación profesional de hardware y software',
        iconName: 'monitor',
        features: ['Setup inicial', 'Migración de datos', 'Configuración de red', 'Capacitación básica'],
      },
      {
        id: 'warranty',
        title: 'Garantías y Diagnóstico',
        description: 'Gestión de garantías y diagnóstico técnico especializado',
        iconName: 'shield',
        features: ['Evaluación técnica', 'Informe detallado', 'Gestión de RMA', 'Seguimiento de casos'],
      },
      {
        id: 'networks',
        title: 'Instalación de Redes',
        description: 'Cableado estructurado y configuración de redes empresariales',
        iconName: 'network',
        features: ['Cableado Cat6/Cat6A', 'Configuración de switches', 'WiFi empresarial', 'Soporte de conectividad'],
      },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
