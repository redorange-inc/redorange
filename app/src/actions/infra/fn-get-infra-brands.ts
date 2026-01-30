'use server';

import type { ApiResponse, BrandsData } from '@/app/(infra)/infra/_components/types';

export const getInfraBrands = async (): Promise<ApiResponse<BrandsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const data: BrandsData = {
    title: 'Marcas y Proveedores',
    subtitle: 'Trabajamos con las mejores marcas del mercado',
    items: [
      { id: 'hp', name: 'HP', category: 'computers', icon: '/icons/infra/hp-icon.svg' },
      { id: 'dell', name: 'Dell', category: 'computers', icon: '/icons/infra/dell-icon.svg' },
      { id: 'lenovo', name: 'Lenovo', category: 'computers', icon: '/icons/infra/lenovo-icon.svg' },
      { id: 'asus', name: 'ASUS', category: 'computers', icon: '/icons/infra/asus-icon.svg' },
      { id: 'cisco', name: 'Cisco', category: 'networking', icon: '/icons/infra/cisco-icon.svg' },
      { id: 'ubiquiti', name: 'Ubiquiti', category: 'networking', icon: '/icons/infra/ubiquiti-icon.svg' },
      { id: 'logitech', name: 'Logitech', category: 'peripherals', icon: '/icons/infra/logitech-icon.svg' },
      { id: 'samsung', name: 'Samsung', category: 'storage', icon: '/icons/infra/samsung-icon.svg' },
    ],
  };

  return {
    data,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
