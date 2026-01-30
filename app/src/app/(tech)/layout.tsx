import type { FC, ReactNode, JSX } from 'react';
import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Navbar } from './_components/navbar';

export const metadata: Metadata = {
  title: 'Tecnología y Soluciones Informáticas (TI) | REDORANGE Tech',
  description: 'Consultoría, desarrollo, soporte y continuidad operativa con métricas claras y enfoque en resultados. Soporte 24/7, entrega ágil y seguridad.',
  keywords: ['servicios TI', 'soporte técnico 24/7', 'desarrollo de software', 'consultoría informática', 'infraestructura TI', 'SLA', 'REDORANGE Tech'],
  openGraph: {
    title: 'Tecnología y Soluciones Informáticas | REDORANGE Tech',
    description: 'Consultoría, desarrollo, soporte y continuidad operativa. 127 proyectos ejecutados, 58 clientes atendidos, 99.8% disponibilidad.',
    url: 'https://redorange.net.pe//tech',
    siteName: 'REDORANGE Tech',
    locale: 'es_PE',
    type: 'website',
    // images: [
    //   {
    //     url: 'https://redorange.net.pe/og-tech.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'REDORANGE Tech - Soluciones TI',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tecnología y Soluciones Informáticas | REDORANGE Tech',
    description: 'Consultoría, desarrollo, soporte y continuidad operativa con métricas claras.',
    // images: ['https://redorange.net.pe/og-tech.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = { children: ReactNode };

const TechLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default TechLayout;
