import type { FC, ReactNode, JSX } from 'react';
import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Navbar } from './_components/navbar';

export const metadata: Metadata = {
  title: 'Comercialización e Importación de Equipos | REDORANGE Infra',
  description: 'Importación, distribución y comercialización de equipos de cómputo, accesorios, telecomunicaciones y robótica. Servicios técnicos especializados con garantía.',
  keywords: [
    'importación equipos',
    'equipos de cómputo',
    'telecomunicaciones',
    'robótica',
    'distribución tecnología',
    'garantía extendida',
    'soporte técnico',
    'ASUS',
    'Cisco',
    'Ubiquiti',
    'Logitech',
    'Samsung',
    'HP',
    'REDORANGE Infra',
  ],
  openGraph: {
    title: 'Comercialización e Importación de Equipos | REDORANGE Infra',
    description: 'Garantía extendida y soporte técnico. +2,500 equipos vendidos, +180 clientes empresariales, +450 importaciones.',
    url: 'https://redorange.net.pe/infra',
    siteName: 'REDORANGE Infra',
    locale: 'es_PE',
    type: 'website',
    // images: [
    //   {
    //     url: 'https://res.cloudinary.com/dqa63t2ls/image/upload/v1234/og-infra.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'REDORANGE Infra - Importación de Equipos',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comercialización e Importación de Equipos | REDORANGE Infra',
    description: 'Importación, distribución y comercialización de equipos de cómputo con garantía y soporte técnico.',
    // images: ['https://res.cloudinary.com/dqa63t2ls/image/upload/v1234/og-infra.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = { children: ReactNode };

const InfraLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default InfraLayout;
