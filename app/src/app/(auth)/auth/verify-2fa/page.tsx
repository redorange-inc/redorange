import { Suspense } from 'react';
import { Verify2FAForm } from '../_components/verify-2fa-form';
import { Loader2 } from 'lucide-react';

const Verify2FAPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <Verify2FAForm />
    </Suspense>
  );
};

export default Verify2FAPage;
