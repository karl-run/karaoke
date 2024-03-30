import { cookies } from 'next/headers';
import { getUserDetails } from '@/db/users';

export async function getUser() {
  const sessionId = cookies().get('session')?.value;
  if (!sessionId) {
    return null;
  }

  const user = await getUserDetails(sessionId);

  return user;
}
