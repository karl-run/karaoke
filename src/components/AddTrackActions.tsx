'use server';

import { addBanger } from '@/db/bangers';
import { getUser } from '@/session/user';

export async function addBangerAction(trackId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error('User not logged in');
    // TODO redirect?
  }

  await addBanger(user.userId, trackId);
}
