'use server';

import { getUser } from '@/session/user';
import { deleteUserCascading } from '@/db/users';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function deleteUserAction() {
  const user = await getUser();

  if (user == null) {
    return {
      error: 'User not found, or user not logged in.',
    };
  }

  await deleteUserCascading(user.userId);

  cookies().delete({
    name: 'session',
    httpOnly: true,
  });

  redirect('/');
}
