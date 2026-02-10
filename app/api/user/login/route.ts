import { NextResponse } from 'next/server';
import { getUserByPin } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { pin } = body;

    if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });

    // Normalize PIN to string and trim
    pin = String(pin).trim();

    console.log(`Login attempt with PIN: ${pin}`); // Debug log

    const user = await getUserByPin(pin);

    if (!user) {
      console.log('Login failed: PIN not found');
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    if (user.paymentStatus !== 'paid') {
       console.log(`Login failed: Payment status is ${user.paymentStatus}`);
       return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

    console.log(`Login success for user: ${user.name} (${user.id})`);

    const response = NextResponse.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            pin: user.pin,
            logo: user.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d4af37&color=000`
        }
    });

    // Set secure cookie for middleware validation
    response.cookies.set('user_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
