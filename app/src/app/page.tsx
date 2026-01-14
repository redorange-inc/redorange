import type { FC } from 'react';
import { Navbar } from './_components/navbar';
import { HeroSection } from './_components/hero-section';
import { ServicesSection } from './_components/services-section';
import { CapabilitiesSection } from './_components/capabilities-section';
import { SeaceSection } from './_components/seace-section';
import { ContactSection } from './_components/contact-section';
import { Footer } from './_components/footer';

const Page: FC = () => {
  return (
    <main className="relative">
      <Navbar />

      <HeroSection />

      <ServicesSection />

      <CapabilitiesSection />

      <SeaceSection />

      <ContactSection />

      <Footer />
    </main>
  );
};

export default Page;
