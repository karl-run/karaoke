'use server';

import { revalidatePath } from 'next/cache';

import { getTracksInPlaylist } from '@/server/spotify/playlist';
import { getIdFromUrl } from '@/components/import-from-spotify/spotify-url-utils';
import { addBangers } from '@/server/db/bangers';
import { getUser } from '@/server/session/user';
import { addToCache } from '@/server/db/song-cache';

export async function importFromSpotifyAction(
  prevState: any,
  form: FormData,
): Promise<{ error?: string | null; tracksAdded?: number | null }> {
  const user = await getUser();

  if (!user) {
    return { error: 'You have to be logged in to import spotify playlists' };
  }

  const url = form.get('url')?.toString();

  if (!url) {
    return { error: 'Missing Spotify URL' };
  }

  const extractedId = getIdFromUrl(url);

  if (!extractedId) {
    return { error: 'Invalid Spotify URL' };
  }

  const tracks = await getTracksInPlaylist(extractedId);

  if ('errorMessage' in tracks) {
    return { error: tracks.errorMessage };
  }

  await addBangers(
    user.userId,
    tracks.map((track) => track.id),
  );

  for (const track of tracks) {
    await addToCache(track);
  }

  revalidatePath('/bangers');

  return {
    tracksAdded: tracks.length,
  };
}
