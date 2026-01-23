'use client';

import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import type { ContactInfo } from './types';

interface ContactInfoSectionProps {
  info: ContactInfo;
}

export const ContactInfoSection = ({ info }: ContactInfoSectionProps) => {
  const badges = [
    { icon: Phone, text: info.phone },
    { icon: Mail, text: info.email },
    { icon: Phone, text: info.phone },
    { icon: Mail, text: info.email },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Image src="/img/svg/support.svg" alt="Soporte" width={280} height={280} className="w-full max-w-[280px] h-auto" />
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-linear-to-l from-background to-transparent" />

        <div className="marquee-badges flex w-max gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 rounded-full border border-infra/20 bg-infra/5 px-4 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
              <badge.icon className="h-4 w-4 text-infra" />
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
          animation: marquee-badges-scroll 12s linear infinite;
        }

        .marquee-badges:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
