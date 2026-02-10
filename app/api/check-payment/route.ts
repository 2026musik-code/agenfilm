import { NextResponse } from 'next/server';
import { getSettings, updateUserPayment, getUserById } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // In a real scenario, we would check Paymenku API status here
    // For now, we simulate success
    const pin = Math.floor(100000 + Math.random() * 900000).toString().trim();

    await updateUserPayment(id, 'paid', pin);

    return NextResponse.json({ success: true, pin });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
