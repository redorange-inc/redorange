'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactInfo } from './types';

interface QuickContactProps {
  info: ContactInfo;
}

export const QuickContact = ({ info }: QuickContactProps) => {
  const whatsappUrl = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent('Hola, me gustaría solicitar información sobre equipos tecnológicos.')}`;

  return (
    <Card className="border-infra/20 bg-linear-to-r from-infra/10 via-infra/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Image src="/icons/whatsapp-icon.svg" alt="WhatsApp" width={28} height={28} className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading font-semibold">¿Necesitas una respuesta rápida?</p>
              <p className="text-sm text-muted-foreground">Escríbenos por WhatsApp</p>
            </div>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-heading">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Image src="/icons/whatsapp-icon.svg" alt="" width={16} height={16} className="mr-2 h-4 w-4 brightness-0 invert" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
