import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/account'];
const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'];

const ORIGIN_ROUTES: Record<string, string> = { tech: '/tech', infra: '/infra', digital: '/digital' };

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && accessToken) {
    const origin = request.cookies.get('auth_origin')?.value;
    const url = request.nextUrl.clone();
    url.pathname = ORIGIN_ROUTES[origin ?? ''] ?? '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)'],
};
