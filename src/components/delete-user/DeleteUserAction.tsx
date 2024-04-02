'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getUser } from '@/server/session/user';
import { deleteUserCascading } from '@/server/db/users';

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
