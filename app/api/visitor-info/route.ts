import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract headers populated by Vercel or middleware
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-visitor-ip') || 'Unknown';
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('x-visitor-country') || 'Unknown';
  const city = request.headers.get('x-vercel-ip-city') || request.headers.get('x-visitor-city') || 'Unknown';
  const region = request.headers.get('x-vercel-ip-region') || 'Unknown';
  const latitude = request.headers.get('x-vercel-ip-latitude') || 'Unknown';
  const longitude = request.headers.get('x-vercel-ip-longitude') || 'Unknown';
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const referer = request.headers.get('referer') || 'Direct';

  // Basic "ISP" detection isn't possible directly without an external API call,
  // but we can mock it or use the headers we have.
  // For a real ISP check, we'd need to fetch `http://ip-api.com/json/${ip}` server-side.

  let isp = "Unknown (ISP detection requires external API)";
  try {
      // Optional: Fetch real ISP data if desired (rate limited usually)
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=isp`, { next: { revalidate: 3600 } }); // minimal fields
      const data = await res.json();
      if (data && data.isp) isp = data.isp;
  } catch (e) {
      console.error("Failed to fetch ISP", e);
  }

  return NextResponse.json({
    ip,
    location: {
      country,
      city,
      region,
      latitude,
      longitude
    },
    userAgent,
    referer,
    isp,
    timestamp: new Date().toISOString()
  });
}
