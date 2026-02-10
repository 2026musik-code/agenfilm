import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
}

export async function GET(req: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    let { paymentKey, price } = body;

    // Ensure price is a number
    price = Number(price);

    if (typeof paymentKey !== 'string' || isNaN(price)) {
      console.error("Invalid input:", { paymentKey, price });
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await updateSettings({ paymentKey, price });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
