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

    // Return safe user data
    return NextResponse.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            pin: user.pin, // User needs to see their PIN in profile
            logo: user.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d4af37&color=000`
        }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
