'use client';

import Image from 'next/image';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactInfo } from './types';

interface ContactInfoSectionProps {
  info: ContactInfo;
}

export const ContactInfoSection = ({ info }: ContactInfoSectionProps) => {
  const contactItems = [
    { icon: Mail, label: 'CORREO ELECTRÓNICO', value: info.email, href: `mailto:${info.email}` },
    { icon: Phone, label: 'TELÉFONO', value: info.phone, href: `tel:${info.phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: 'WHATSAPP', value: info.phone, href: `https://wa.me/${info.whatsapp}` },
  ];

  const badges = [
    { icon: Mail, text: info.email },
    { icon: Phone, text: info.phone },
    { icon: Mail, text: info.email },
    { icon: Phone, text: info.phone },
  ];

  return (
    <div className="space-y-4">
      {/* Header con SVG */}
      <div className="flex items-center gap-3">
        <Image src="/img/svg/support.svg" alt="Soporte" width={48} height={48} className="h-12 w-12" />
        <h2 className="font-heading text-xl font-bold">Información de Contacto</h2>
      </div>

      {/* Contact Cards */}
      <div className="space-y-3">
        {contactItems.map((item, index) => (
          <Card key={index} className="border-infra/20 bg-card/60 backdrop-blur-md transition-all hover:border-infra/40 hover:shadow-md">
            <CardContent className="p-4">
              <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-infra/10 group-hover:bg-infra/20 transition-colors">
                  <item.icon className="h-5 w-5 text-infra" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="font-medium text-foreground group-hover:text-infra transition-colors">{item.value}</p>
                </div>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marquee Badges */}
      <div className="relative overflow-hidden pt-4">
        <div className="pointer-events-none absolute left-0 top-4 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-4 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />

        <div className="marquee-badges flex w-max gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 rounded-full border border-infra/20 bg-infra/5 px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
              <badge.icon className="h-3 w-3 text-infra" />
              {badge.text}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-badges-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-badges {
          animation: marquee-badges-scroll 15s linear infinite;
        }

        .marquee-badges:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
