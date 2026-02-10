import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';

const ADMIN_PASSWORD = 'Nina131@';

export async function GET(req: Request) {
  // Simple auth check via header
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { paymentKey, price } = body;

    if (typeof paymentKey !== 'string' || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await updateSettings({ paymentKey, price });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
