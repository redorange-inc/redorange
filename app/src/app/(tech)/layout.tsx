import type { FC, ReactNode, JSX } from 'react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from './_components/navbar';

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
