import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const capabilities = [
  {
    title: 'Consultoría, implementación y soporte',
    items: [
      'Levantamiento de requerimientos y alcance técnico',
      'Plan de trabajo, cronograma y entregables',
      'Soporte remoto y presencial (según necesidad)',
      'Mantenimiento preventivo y correctivo',
      'Mesa de ayuda y atención por niveles',
    ],
  },
  {
    title: 'Seguridad, continuidad y disponibilidad',
    items: [
      'Hardening, control de accesos y buenas prácticas',
      'Backups, recuperación y pruebas de restauración',
      'Monitoreo y alertamiento',
      'Documentación técnica y operativa',
      'Gestión de incidencias y cambios',
    ],
  },
  {
    title: 'Capacitación y transferencia',
    items: [
      'Capacitación especializada para usuarios y administradores',
      'Manual de usuario y manual técnico',
      'Transferencia de conocimiento',
      'Capacitación en SIGA, SIAF y SEACE',
      'Acompañamiento en puesta en marcha',
    ],
  },
] as const;

export const CapabilitiesSection: FC = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      {/*  section header */}
      <div className="mb-10 flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold md:text-3xl">Capacidades técnicas</h2>
        <p className="max-w-3xl text-muted-foreground">Nuestra forma de trabajo prioriza control, trazabilidad y documentación, con enfoque en continuidad operativa y seguridad de la información.</p>
      </div>

      {/*  capability cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {capabilities.map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle className="text-lg font-extrabold">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
