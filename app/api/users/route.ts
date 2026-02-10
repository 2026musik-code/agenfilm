import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';
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

  const users = await getUsers();
  return NextResponse.json(users);
}
