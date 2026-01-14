// app/_components/about-section.tsx
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pillars = [
  {
    title: 'Claridad en alcance',
    body: 'Definimos objetivos, entregables y criterios de aceptación para evitar ambigüedades y asegurar resultados.',
  },
  {
    title: 'Ejecución y soporte',
    body: 'Implementamos con buenas prácticas y acompañamos con soporte, mantenimiento y mejora continua.',
  },
  {
    title: 'Escalabilidad',
    body: 'Diseñamos pensando en crecimiento: rendimiento, seguridad, monitoreo y continuidad operativa.',
  },
] as const;

export const AboutSection: FC = () => {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-28">
      {/*  section header */}
      <div className="mb-10 flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit font-heading">
          Nosotros
        </Badge>
        <h2 className="text-2xl font-extrabold md:text-3xl">Red Orange E.I.R.L.</h2>
        <p className="max-w-3xl text-muted-foreground">
          Somos un equipo orientado a resolver necesidades reales con soluciones tecnológicas integrales: desde el diseño y la implementación hasta el soporte y la continuidad. Trabajamos con un enfoque
          práctico, medible y alineado a objetivos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title} className="border-border/70">
            <CardHeader>
              <CardTitle className="text-lg font-extrabold">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
