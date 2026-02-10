import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Define routes that are always public
const PUBLIC_FILE_EXTENSIONS = ['.ico', '.svg', '.png', '.jpg', '.jpeg', '.webp'];

const PUBLIC_ROUTES = [
  '/login',
  '/daftar',
  '/admin', // Admin has its own auth
];

export function middleware(request: NextRequest) {
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

  // 5. Check for user session cookie
  const hasSession = request.cookies.has('user_session');

  // 6. Redirect Logic

  // If trying to access a protected route without session -> Redirect to Login
  if (!isPublic && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing Login/Register while logged in -> Redirect to Home
  if ((pathname === '/login' || pathname === '/daftar') && hasSession) {
     return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
