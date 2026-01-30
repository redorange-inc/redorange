'use client';

import { Button } from '@/components/ui/button';
import { useAuthActions } from '@/hooks/use-auth';
import { LogIn } from 'lucide-react';

interface SignInButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const SignInButton = ({ variant = 'default', size = 'default', className, showIcon = false, children }: SignInButtonProps) => {
  const { goToLogin } = useAuthActions();

  return (
    <Button variant={variant} size={size} onClick={goToLogin} className={className}>
      {showIcon && <LogIn className="mr-2 h-4 w-4" />}
      {children || 'Iniciar Sesión'}
    </Button>
  );
};
