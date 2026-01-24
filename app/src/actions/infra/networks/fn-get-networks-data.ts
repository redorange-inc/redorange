'use server';

import type { ApiResponse, NetworksPageData } from '@/app/(infra)/infra/networks/_components/types';

export const getNetworksData = async (): Promise<ApiResponse<NetworksPageData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const data: NetworksPageData = {
    hero: {
      badge: 'Redes e Infraestructura',
      tag: 'Conectividad Empresarial',
      title: 'Soluciones en Redes',
      description: 'Diseño, instalación y mantenimiento de redes empresariales. Cableado estructurado, configuración de equipos y soporte de conectividad.',
    },
    services: [
      {
        id: 'cableado',
        title: 'Cableado Estructurado',
        description: 'Instalación profesional de cableado de red categoría 5e, 6 y 6A.',
        iconName: 'cable',
        features: ['Puntos de red', 'Patch panels', 'Certificación', 'Fibra óptica'],
      },
      {
        id: 'wifi',
        title: 'Redes Inalámbricas',
        description: 'Implementación de redes WiFi empresariales con cobertura total.',
        iconName: 'wifi',
        features: ['Access Points', 'Mesh Networks', 'Guest Networks', 'Seguridad WPA3'],
      },
      {
        id: 'configuracion',
        title: 'Configuración de Equipos',
        description: 'Setup y configuración de routers, switches y firewalls.',
        iconName: 'router',
        features: ['VLANs', 'QoS', 'VPN', 'Firewall rules'],
      },
      {
        id: 'monitoreo',
        title: 'Monitoreo de Red',
        description: 'Supervisión 24/7 del rendimiento y seguridad de tu red.',
        iconName: 'activity',
        features: ['Alertas en tiempo real', 'Reportes mensuales', 'Análisis de tráfico', 'Detección de amenazas'],
      },
      {
        id: 'soporte',
        title: 'Soporte de Conectividad',
        description: 'Diagnóstico y solución de problemas de red.',
        iconName: 'headphones',
        features: ['Troubleshooting', 'Optimización', 'Expansión', 'Migración'],
      },
      {
        id: 'datacenter',
        title: 'Data Center',
        description: 'Diseño e implementación de cuartos de telecomunicaciones.',
        iconName: 'server',
        features: ['Racks', 'UPS', 'Climatización', 'Organización'],
      },
    ],
    benefits: [
      { title: 'Conectividad Estable', description: 'Redes diseñadas para máximo uptime y rendimiento', iconName: 'signal' },
      { title: 'Escalabilidad', description: 'Infraestructura que crece con tu empresa', iconName: 'trendingUp' },
      { title: 'Seguridad', description: 'Protección integral contra amenazas de red', iconName: 'shield' },
      { title: 'Soporte Incluido', description: 'Asistencia técnica post-instalación', iconName: 'headphones' },
    ],
    projects: [
      { id: '1', title: 'Oficina Corporativa', description: 'Red completa con 120 puntos', category: 'Cableado', points: 120 },
      { id: '2', title: 'Campus Universitario', description: 'WiFi mesh con 50 APs', category: 'Inalámbrico', points: 50 },
      { id: '3', title: 'Centro Comercial', description: 'Backbone de fibra óptica', category: 'Fibra', points: 200 },
      { id: '4', title: 'Empresa Logística', description: 'VPN multi-sede', category: 'VPN', points: 15 },
    ],
    technologies: [
      { id: 'cisco', name: 'Cisco', icon: '/icons/infra/cisco-icon.svg' },
      { id: 'ubiquiti', name: 'Ubiquiti', icon: '/icons/infra/ubiquiti-icon.svg' },
      { id: 'mikrotik', name: 'MikroTik' },
      { id: 'tplink', name: 'TP-Link' },
      { id: 'aruba', name: 'Aruba' },
      { id: 'fortinet', name: 'Fortinet' },
    ],
    contactPhone: '+51 987 370 699',
    contactWhatsapp: '51987370699',
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
