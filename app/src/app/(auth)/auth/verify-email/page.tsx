import { Suspense } from 'react';
import { VerifyEmailForm } from '../_components/verify-email-form';
import { Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando...</p>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
