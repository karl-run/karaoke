'use server';

import { revalidateTag } from 'next/cache';

import { bestGuessTrack, getTrack } from 'server/spotify/track';
import { addBanger } from 'server/bangers/bangers-db';

import { getUser } from '@/server/user/user-service';

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

  const track = await getTrack(songId, true);
  await addBanger(user.userId, track);

  revalidateTag('bangers');

  return {
    ok: true,
  };
}
