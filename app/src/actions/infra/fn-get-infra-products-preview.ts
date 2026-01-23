'use server';

import type { ApiResponse, ProductsPreviewData } from '@/app/(infra)/infra/_components/types';

export const getInfraProductsPreview = async (): Promise<ApiResponse<ProductsPreviewData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: ProductsPreviewData = {
    items: [
      {
        id: 'computers',
        title: 'Equipos de Cómputo',
        description: 'Computadoras, laptops, workstations y servidores de alto rendimiento',
        iconName: 'monitor',
        items: ['Laptops empresariales', 'PCs de escritorio', 'Workstations', 'All-in-One'],
        featured: true,
      },
      {
        id: 'accessories',
        title: 'Accesorios y Periféricos',
        description: 'Teclados, mouse, monitores, webcams y más',
        iconName: 'keyboard',
        items: ['Monitores', 'Teclados mecánicos', 'Mouse ergonómicos', 'Webcams HD'],
        featured: true,
      },
      {
        id: 'supplies',
        title: 'Suministros Tecnológicos',
        description: 'Cables, adaptadores, memorias y almacenamiento',
        iconName: 'hardDrive',
        items: ['Memorias RAM', 'Discos SSD/HDD', 'Cables HDMI/USB', 'Adaptadores'],
        featured: false,
      },
      {
        id: 'telecom',
        title: 'Telecomunicaciones',
        description: 'Routers, switches, access points y equipos de red',
        iconName: 'router',
        items: ['Routers empresariales', 'Switches administrables', 'Access Points WiFi 6', 'Firewalls'],
        featured: true,
      },
      {
        id: 'robotics',
        title: 'Robótica',
        description: 'Kits educativos, brazos robóticos y componentes',
        iconName: 'cpu',
        items: ['Kits Arduino', 'Raspberry Pi', 'Brazos robóticos', 'Sensores'],
        featured: false,
      },
    ],
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
