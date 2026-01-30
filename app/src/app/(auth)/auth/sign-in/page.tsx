import { Suspense } from 'react';
import { SignInForm } from '../_components/sign-in-form';
import { Loader2 } from 'lucide-react';

const SignInPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
