import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth/session';

const protectedRoutes = ['/write', '/dashboard', '/library'];
const authRoutes = ['/login'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const cookie = req.cookies.get('awakening-session')?.value;
  const session = await decrypt(cookie);
  const isAuthenticated = !!session?.userId;

  if (protectedRoutes.some(r => path.startsWith(r)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (authRoutes.some(r => path.startsWith(r)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};
