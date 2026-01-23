'use server';

import type { ApiResponse, ProductsData } from '@/app/(infra)/infra/_components/types';

export const getInfraProducts = async (): Promise<ApiResponse<ProductsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: ProductsData = {
    categories: [
      {
        id: 'computers',
        title: 'Equipos de Cómputo',
        description: 'Computadoras, laptops, workstations y servidores de alto rendimiento',
        iconName: 'monitor',
        items: ['Laptops empresariales', 'PCs de escritorio', 'Workstations', 'All-in-One', 'Mini PCs', 'Servidores'],
        featured: true,
      },
      {
        id: 'accessories',
        title: 'Accesorios y Periféricos',
        description: 'Teclados, mouse, monitores, webcams y más',
        iconName: 'keyboard',
        items: ['Monitores', 'Teclados mecánicos', 'Mouse ergonómicos', 'Webcams HD', 'Headsets', 'Docking stations'],
        featured: true,
      },
      {
        id: 'supplies',
        title: 'Suministros Tecnológicos',
        description: 'Cables, adaptadores, memorias y almacenamiento',
        iconName: 'cable',
        items: ['Memorias RAM', 'Discos SSD/HDD', 'Cables HDMI/USB', 'Adaptadores', 'UPS y reguladores', 'Fuentes de poder'],
      },
      {
        id: 'telecom',
        title: 'Telecomunicaciones',
        description: 'Routers, switches, access points y equipos de red',
        iconName: 'router',
        items: ['Routers empresariales', 'Switches administrables', 'Access Points WiFi 6', 'Firewalls', 'Módems', 'Antenas'],
        featured: true,
      },
      {
        id: 'robotics',
        title: 'Robótica',
        description: 'Kits educativos, brazos robóticos y componentes',
        iconName: 'cpu',
        items: ['Kits Arduino', 'Raspberry Pi', 'Brazos robóticos', 'Sensores', 'Motores y servos', 'Impresoras 3D'],
      },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
