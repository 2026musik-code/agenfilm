import { NextResponse } from 'next/server';
import { addUser } from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, pin } = await req.json();

    if (!name || !email || !pin) {
      return NextResponse.json({ error: 'Name, email, and PIN are required' }, { status: 400 });
    }

    if (pin.length < 5) {
        return NextResponse.json({ error: 'PIN must be at least 5 digits' }, { status: 400 });
    }

    const newUser = {
      id: `MANUAL-${Date.now()}`,
      name,
      email,
      pin,
      paymentStatus: 'paid' as const,
      qrCode: '',
      qrUrl: '',
      createdAt: new Date().toISOString()
    };

    await addUser(newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Manual user creation error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
