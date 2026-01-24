'use client';

import Image from 'next/image';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ContactCTAProps {
  phone: string;
  whatsapp: string;
}

export const ContactCTA = ({ phone, whatsapp }: ContactCTAProps) => {
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, necesito servicio técnico para mis equipos.')}`;

  return (
    <Card className="border-infra/20 bg-gradient-to-r from-infra/10 via-infra/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-infra/10">
              <Phone className="h-6 w-6 text-infra" />
            </div>
            <div>
              <p className="font-heading font-semibold">¿Necesitas servicio técnico urgente?</p>
              <p className="text-sm text-muted-foreground">Contáctanos ahora: {phone}</p>
            </div>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-heading">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src="/icons/whatsapp-icon.svg"
                alt=""
                width={16}
                height={16}
                className="mr-2 h-4 w-4 brightness-0 invert"
              />
              Solicitar Servicio
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
