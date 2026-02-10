import { NextResponse } from 'next/server';
import { getUserByPin } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });

    const user = await getUserByPin(pin);
    if (!user) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    if (user.paymentStatus !== 'paid') {
       return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
