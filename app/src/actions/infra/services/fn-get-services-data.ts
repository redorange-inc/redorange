'use server';

import type { ApiResponse, ServicesPageData } from '@/app/(infra)/infra/services/_components/types';

export const getServicesData = async (): Promise<ApiResponse<ServicesPageData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const data: ServicesPageData = {
    hero: {
      badge: 'Servicios Técnicos',
      tag: 'Soporte Especializado',
      title: 'Servicios Técnicos Profesionales',
      description: 'Reparación, mantenimiento y soporte técnico para tus equipos de cómputo y telecomunicaciones. Técnicos certificados con garantía de servicio.',
    },
    services: [
      {
        id: 'diagnostico',
        title: 'Diagnóstico de Equipos',
        description: 'Evaluación completa del estado de tu equipo para identificar fallas y soluciones.',
        iconName: 'search',
        features: ['Revisión de hardware', 'Análisis de software', 'Informe detallado', 'Sin compromiso'],
        price: 'Gratis',
      },
      {
        id: 'reparacion',
        title: 'Reparación de Equipos',
        description: 'Servicio técnico especializado para laptops, PCs, impresoras y equipos de red.',
        iconName: 'wrench',
        features: ['Cambio de componentes', 'Reparación de placas', 'Recuperación de datos', 'Garantía incluida'],
      },
      {
        id: 'mantenimiento',
        title: 'Mantenimiento Preventivo',
        description: 'Limpieza, optimización y actualización para alargar la vida útil de tus equipos.',
        iconName: 'settings',
        features: ['Limpieza física', 'Optimización de sistema', 'Actualización de drivers', 'Backup de datos'],
      },
      {
        id: 'instalacion',
        title: 'Instalación de Equipos',
        description: 'Configuración e instalación profesional de equipos nuevos en tu oficina o empresa.',
        iconName: 'monitor',
        features: ['Setup completo', 'Configuración de red', 'Instalación de software', 'Capacitación básica'],
      },
      {
        id: 'soporte',
        title: 'Soporte Remoto',
        description: 'Asistencia técnica a distancia para resolver problemas de software y configuración.',
        iconName: 'headphones',
        features: ['Conexión segura', 'Resolución rápida', 'Sin desplazamiento', 'Horario extendido'],
      },
      {
        id: 'recuperacion',
        title: 'Recuperación de Datos',
        description: 'Recuperamos información de discos dañados, formateados o con fallas.',
        iconName: 'hardDrive',
        features: ['Discos HDD/SSD', 'Memorias USB', 'Servidores', 'Alta tasa de éxito'],
      },
    ],
    benefits: [
      { title: 'Tiempo de atención', value: '< 24h', iconName: 'clock' },
      { title: 'Técnicos certificados', value: '10+', iconName: 'award' },
      { title: 'Satisfacción', value: '98%', iconName: 'thumbsUp' },
    ],
    process: [
      { number: 1, title: 'Contacto', description: 'Cuéntanos el problema de tu equipo' },
      { number: 2, title: 'Diagnóstico', description: 'Evaluamos y te damos un presupuesto' },
      { number: 3, title: 'Reparación', description: 'Ejecutamos el servicio técnico' },
      { number: 4, title: 'Entrega', description: 'Recibe tu equipo con garantía' },
    ],
    faqs: [
      { question: '¿Cuánto demora una reparación?', answer: 'Dependiendo del problema, entre 24 y 72 horas hábiles. Te informamos el tiempo exacto después del diagnóstico.' },
      { question: '¿Tienen garantía los servicios?', answer: 'Sí, todos nuestros servicios incluyen garantía de 30 a 90 días según el tipo de reparación.' },
      { question: '¿Hacen servicio a domicilio?', answer: 'Sí, ofrecemos servicio técnico a domicilio en Lima Metropolitana con costo adicional.' },
      { question: '¿Trabajan con empresas?', answer: 'Sí, tenemos planes de mantenimiento preventivo y soporte técnico para empresas.' },
    ],
    contactPhone: '+51 987 370 699',
    contactWhatsapp: '51987370699',
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
