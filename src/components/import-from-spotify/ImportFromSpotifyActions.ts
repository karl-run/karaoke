'use server';

import { getTracksInPlaylist } from '@/spotify/playlist';
import { getIdFromUrl } from '@/components/import-from-spotify/spotify-url-utils';
import { addBangers } from '@/db/bangers';
import { getUser } from '@/session/user';
import { addToCache } from '@/db/song-cache';
import { revalidatePath } from 'next/cache';

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
