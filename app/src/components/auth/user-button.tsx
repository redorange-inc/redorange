'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthActions, useAuth } from '@/hooks/use-auth';
import { User, Shield, Monitor, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface UserButtonProps {
  showName?: boolean;
  className?: string;
}

export const UserButton = ({ showName = false, className }: UserButtonProps) => {
  const { user } = useAuth();
  const { logout } = useAuthActions();

  if (!user) return null;

  const initials = `${user.name[0]}${user.last_name[0]}`.toUpperCase();
  const fullName = `${user.name} ${user.last_name}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profile} alt={fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
          </Avatar>
          {showName && (
            <>
              <span className="text-sm font-medium hidden sm:inline-block">{user.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/security" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Seguridad</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/sessions" className="cursor-pointer">
              <Monitor className="mr-2 h-4 w-4" />
              <span>Sesiones</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
