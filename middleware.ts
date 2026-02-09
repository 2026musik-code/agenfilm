import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory blocklist (for demonstration)
const BLOCKED_IPS = ['1.2.3.4'];
const BLOCKED_COUNTRIES = ['XX']; // Use ISO 3166-1 alpha-2 country codes

export function middleware(request: NextRequest) {
  // 1. Extract Visitor Data
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // Vercel GeoIP headers or fallback
  // Note: request.geo is not reliably typed in all Next.js versions/environments, using headers is safer for Vercel.
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
  const referer = request.headers.get('referer') || 'Direct';

  // 2. Log Visitor Data (Visible in Vercel Logs)
  console.log(`[Visitor] IP: ${ip} | Country: ${country} | City: ${city} | UA: ${userAgent} | Ref: ${referer}`);

  // 3. Blocking Logic
  const isBlockedIP = BLOCKED_IPS.includes(ip);
  const isBlockedCountry = BLOCKED_COUNTRIES.includes(country);

  if (isBlockedIP || isBlockedCountry) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Access Denied. Your IP or Region is blocked.' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    );
  }

  // 4. Pass data to headers for downstream consumption
  const response = NextResponse.next();
  response.headers.set('x-visitor-ip', ip);
  response.headers.set('x-visitor-country', country);
  response.headers.set('x-visitor-city', city);

  const region = request.headers.get('x-vercel-ip-region');
  if (region) response.headers.set('x-visitor-region', region);

  const latitude = request.headers.get('x-vercel-ip-latitude');
  if (latitude) response.headers.set('x-visitor-latitude', latitude);

  const longitude = request.headers.get('x-vercel-ip-longitude');
  if (longitude) response.headers.set('x-visitor-longitude', longitude);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
