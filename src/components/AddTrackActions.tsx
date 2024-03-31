'use server';

import { addBanger, removeBanger } from '@/db/bangers';
import { getUser } from '@/session/user';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function addBangerAction(trackId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error('User not logged in');
    // TODO redirect?
  }

  await addBanger(user.userId, trackId);

  revalidatePath('/');
}

export async function removeBangerAction(trackId: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const user = await getUser();

  if (!user) {
    throw new Error('User not logged in');
    // TODO redirect?
  }

  await removeBanger(user.userId, trackId);

  revalidatePath('/bangers');
}
