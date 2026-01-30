import { Suspense } from 'react';
import { CallbackHandler } from './_components/callback-handler';
import { Loader2 } from 'lucide-react';

const CallbackPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
};

export default CallbackPage;
