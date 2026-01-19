import type { FC, ReactNode, JSX } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

type Props = { children: ReactNode };

const PublicLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
