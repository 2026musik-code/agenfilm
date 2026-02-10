import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/db';
import { cookies } from 'next/headers';

async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const success = await deleteUser(id);

  if (success) {
      return NextResponse.json({ success: true });
  } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
