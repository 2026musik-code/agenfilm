import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-token';
import { User } from '@/types/user';

export async function validateSession(): Promise<User> {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Stateless validation: Trust the token if it's signed validly
  // We assume paymentStatus is correct in the token
  if (session.paymentStatus !== 'paid') {
     redirect('/api/auth/logout');
  }

  return {
      id: session.id as string,
      name: session.name as string,
      email: session.email as string,
      pin: session.pin as string,
      paymentStatus: session.paymentStatus as 'paid' | 'pending' | 'failed',
      logo: session.logo as string | undefined
  } as User;
}
