import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const serviceCards = [
  {
    id: 'it-technology',
    title: 'IT & Technology Solutions',
    subtitle: 'TI, software, cloud y soporte',
    points: [
      'Consultoría TI y transformación digital',
      'Desarrollo de software y sistemas a medida',
      'Administración de servidores, redes y bases de datos',
      'Mesa de ayuda y soporte técnico',
      'Mantenimiento preventivo y correctivo',
      'Capacitación SIGA, SIAF y SEACE',
    ],
  },
  {
    id: 'digital-web',
    title: 'Digital & Web Services',
    subtitle: 'Web, hosting, dominios y correo',
    points: [
      'Diseño y desarrollo web institucional',
      'E-commerce y plataformas digitales',
      'Hosting, dominios y certificados',
      'Correo corporativo y seguridad web',
      'Intranet y extranet',
      'Producción multimedia y soporte',
    ],
  },
  {
    id: 'infra-telecom',
    title: 'Hardware, Telecom & Infrastructure',
    subtitle: 'Equipos, conectividad e instalación',
    points: [
      'Importación, distribución y comercialización de equipos',
      'Telecomunicaciones e internet dedicado',
      'Instalación de redes y cableado estructurado',
      'Mantenimiento y soporte postventa',
      'Storage y servicios de infraestructura',
      'Soluciones eléctricas y paneles solares',
    ],
  },
] as const;

export const ServicesSection: FC = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      {/*  section header */}
      <div className="mb-10 flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold md:text-3xl">Líneas de servicio</h2>
        <p className="max-w-3xl text-muted-foreground">Estructuramos nuestra oferta en tres áreas para facilitar el alcance, la gestión del servicio y la documentación técnica en procesos de contratación.</p>
      </div>

      {/*  cards with anchors */}
      <div className="grid gap-6 md:grid-cols-3">
        {serviceCards.map((card) => (
          <Card key={card.id} id={card.id} className="scroll-mt-28">
            <CardHeader>
              <CardTitle className="text-xl font-extrabold">{card.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{card.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {card.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <div className="flex items-center gap-2">
                <Button asChild variant="secondary" className="font-heading">
                  <Link href="/#contact">Cotizar</Link>
                </Button>
                <Button asChild variant="ghost" className="font-heading">
                  <Link href="/#seace">Ver enfoque SEACE</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
