'use client';

import type { FC } from 'react';
import { HeroSection } from './_components/hero-section';
import { ServicesScroller } from './_components/services-scroller';
import { AboutSection } from './_components/about-section';
import { ContactSection } from './_components/contact-section';

const Page: FC = () => {
  return (
    <main className="relative">
      <HeroSection />
      <ServicesScroller />
      <AboutSection />
      <ContactSection />
    </main>
  );
};

export default Page;
