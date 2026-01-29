'use client';

import { useAuth } from '@/hooks/use-auth';
import { SignInButton } from './sign-in-button';
import { UserButton } from './user-button';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthStatusProps {
  signInVariant?: 'default' | 'outline' | 'ghost';
  signInClassName?: string;
  showUserName?: boolean;
  className?: string;
}

export const AuthStatus = ({ signInVariant = 'default', signInClassName, showUserName = false, className }: AuthStatusProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Skeleton className="h-9 w-24 rounded-md" />;

  if (isAuthenticated) return <UserButton showName={showUserName} className={className} />;

  return <SignInButton variant={signInVariant} className={signInClassName} />;
};
