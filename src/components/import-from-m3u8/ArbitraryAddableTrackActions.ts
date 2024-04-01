'use server';

import { bestGuessTrack } from '@/spotify/track';
import { getUser } from '@/session/user';
import { addBanger } from '@/db/bangers';

export async function tryToFindSongAction(search: string) {
  return bestGuessTrack(search);
}

export async function addSongAction(songId: string) {
  const user = await getUser();

  if (!user) {
    return {
      error: 'not-logged-in',
    };
  }

  await addBanger(user.userId, songId);

  return {
    ok: true,
  };
}
