import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db';

export async function validateSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_session')?.value;

  if (!userId) {
    redirect('/login');
  }

  const user = await getUserById(userId);
  if (!user || user.paymentStatus !== 'paid') {
     redirect('/api/auth/logout');
  }

  return user;
}
