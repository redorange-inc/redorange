'use server';

import type { ApiResponse, BrandsData } from '@/app/(infra)/infra/_components/types';

export const getInfraBrands = async (): Promise<ApiResponse<BrandsData>> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockData: BrandsData = {
    items: [
      { id: 'hp', name: 'HP', category: 'computers' },
      { id: 'dell', name: 'Dell', category: 'computers' },
      { id: 'lenovo', name: 'Lenovo', category: 'computers' },
      { id: 'asus', name: 'ASUS', category: 'computers' },
      { id: 'acer', name: 'Acer', category: 'computers' },
      { id: 'cisco', name: 'Cisco', category: 'networking' },
      { id: 'tplink', name: 'TP-Link', category: 'networking' },
      { id: 'ubiquiti', name: 'Ubiquiti', category: 'networking' },
      { id: 'mikrotik', name: 'MikroTik', category: 'networking' },
      { id: 'logitech', name: 'Logitech', category: 'peripherals' },
      { id: 'samsung', name: 'Samsung', category: 'storage' },
      { id: 'western-digital', name: 'Western Digital', category: 'storage' },
      { id: 'kingston', name: 'Kingston', category: 'storage' },
      { id: 'seagate', name: 'Seagate', category: 'storage' },
      { id: 'apc', name: 'APC', category: 'power' },
    ],
  };

  return {
    data: mockData,
    meta: { timestamp: new Date().toISOString(), source: 'static-data' },
  };
};
