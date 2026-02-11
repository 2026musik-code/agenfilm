import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth-token';

// 1. Define routes that are always public
const PUBLIC_FILE_EXTENSIONS = ['.ico', '.svg', '.png', '.jpg', '.jpeg', '.webp'];

const PUBLIC_ROUTES = [
  '/login',
  '/daftar',
  '/admin', // Admin has its own auth (can be updated to JWT too but minimal changes for now)
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Allow API routes (they handle their own auth or are public)
  if (pathname.startsWith('/api')) {
      return NextResponse.next();
  }

  // 3. Allow Next.js internals and static assets
  if (
      pathname.startsWith('/_next') ||
      PUBLIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext))
  ) {
      return NextResponse.next();
  }

  // 4. Check if the current route is public
  const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

  // 5. Check for user session cookie (JWT)
  const token = request.cookies.get('user_session')?.value;
  let session = null;
  if (token) {
      session = await verifySession(token);
  }

  // 6. Redirect Logic

  // If trying to access a protected route without session -> Redirect to Login
  if (!isPublic && !session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing Login/Register while logged in -> Redirect to Home
  if ((pathname === '/login' || pathname === '/daftar') && session) {
     return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
