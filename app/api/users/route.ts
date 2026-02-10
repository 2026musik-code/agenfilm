import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

const ADMIN_PASSWORD = 'Nina131@';

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await getUsers();
  return NextResponse.json(users);
}
