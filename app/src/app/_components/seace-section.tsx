import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const seaceBlocks = [
  {
    title: 'Uso como soporte documental',
    body: 'Estas secciones pueden ser referenciadas en propuestas y anexos, indicando capacidades, alcance y metodología de atención.',
  },
  {
    title: 'Estructura recomendada visible',
    body: 'Mantener accesible: Servicios, Capacidades Técnicas, Soporte y Mantenimiento, y Capacitación, para facilitar la verificación por el comité.',
  },
  {
    title: 'Coherencia con objeto social',
    body: 'El contenido está alineado a consultoría, implementación, soporte, mantenimiento, comercialización y capacitación en tecnología y telecomunicaciones.',
  },
] as const;

export const SeaceSection: FC = () => {
  return (
    <section id="seace" className="mx-auto max-w-6xl px-4 pb-16 scroll-mt-28">
      {/*  section header */}
      <div className="mb-10 flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold md:text-3xl">Enfoque para procesos SEACE</h2>
        <p className="max-w-3xl text-muted-foreground">Presentamos una redacción técnica y formal, orientada a TDR, alcance verificable, soporte postventa y transferencia de conocimiento.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {seaceBlocks.map((b) => (
          <Card key={b.title}>
            <CardHeader>
              <CardTitle className="text-lg font-extrabold">{b.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{b.body}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-extrabold">Recomendación final</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Para licitaciones, sugerimos utilizar esta web como soporte documental y referenciar a <span className="font-semibold text-foreground">Red Orange E.I.R.L.</span> en toda la documentación.
            </p>
            <Separator />
            <ul className="list-disc space-y-2 pl-5">
              <li>Usar enlaces directos a las secciones por ancla: it-technology, digital-web, infra-telecom.</li>
              <li>Adjuntar capturas o enlaces como evidencia de capacidades y alcance.</li>
              <li>Detallar soporte, mantenimiento y capacitación como parte del servicio.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
