'use server';

import { revalidatePath } from 'next/cache';

import { getPlaylistWithTracks } from 'server/spotify/playlist';
import { addBangers } from 'server/bangers/bangers-db';
import { addToCache } from 'server/bangers/bangers-cache';

import { getIdFromUrl } from '@/components/import-from-spotify/spotify-url-utils';
import { getUser } from '@/server/user/user-service';

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

  const playlist = await getPlaylistWithTracks(extractedId);

  if ('errorMessage' in playlist) {
    return { error: playlist.errorMessage };
  }

  await addBangers(user.userId, playlist.tracks);

  for (const track of playlist.tracks) {
    await addToCache(track);
  }

  revalidatePath('/bangers');

  return {
    tracksAdded: playlist.tracks.length,
  };
}
