import type { ReactNode } from 'react';
import { Navbar } from './_components/navbar';
import { Footer } from '@/components/layout/footer';

interface AccountLayoutProps {
  children: ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container max-w-4xl mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountLayout;
