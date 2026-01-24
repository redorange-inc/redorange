import type { Metadata } from 'next';
import { Navbar } from './_components/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Red Orange Infra',
    default: 'Infra - Comercialización e Importación de Equipos | Red Orange',
  },
  description: 'Comercialización, importación y servicios técnicos de equipos tecnológicos. Equipos de cómputo, accesorios, telecomunicaciones y robótica.',
};

export default function InfraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[61px]">{children}</main>
      <Footer />
    </div>
  );
}
