'use client';

import type { FC } from 'react';
import { Navbar } from './_components/navbar';
import { HeroSection } from './_components/hero-section';
import { ContactSection } from './_components/contact-section';
import { Footer } from './_components/footer';
import { ServicesScroller } from './_components/services-scroller';
import { AboutSection } from './_components/about-section';

const Page: FC = () => {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <ServicesScroller />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Page;
