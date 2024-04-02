'use server';

import { revalidatePath } from 'next/cache';

import { addBanger, removeBanger } from '@/server/db/bangers';
import { getUser } from '@/server/session/user';

export async function addBangerAction(trackId: string): Promise<{ error: 'not-logged-in' } | { ok: true }> {
  const user = await getUser();

  if (!user) {
    return {
      error: 'not-logged-in',
    };
  }

  await addBanger(user.userId, trackId);

  revalidatePath('/');

  return {
    ok: true,
  };
}

export async function removeBangerAction(trackId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error('User not logged in');
    // TODO redirect?
  }

  await removeBanger(user.userId, trackId);

  revalidatePath('/bangers');
}
