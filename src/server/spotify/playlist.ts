import { spotifyFetch } from 'server/spotify/auth';
import { SpotifyTrack } from 'server/spotify/types';
import { spotifyTrackToTrackResult } from 'server/spotify/mapper';

type PlaylistResponse = {
  name: string;
  owner: {
    display_name: string;
  };
  tracks: {
    offset: number;
    total: number;
    next: string;
    items: { track: SpotifyTrack }[];
  };
};

export async function getPlaylistWithTracks(playlistId: string) {
  try {
    const playlist = await spotifyFetch<PlaylistResponse>(`/v1/playlists/${playlistId}`);
    const restOfTracks = playlist.tracks.next ? await traverseTracks(playlist.tracks.next) : [];

    const tracks = [...playlist.tracks.items, ...restOfTracks]
      .map((item) => item.track)
      .map(spotifyTrackToTrackResult)
      // Remove weird empty track?!
      .filter((it) => it.name !== '');

    return {
      name: playlist.name,
      owner: playlist.owner.display_name,
      tracks,
    };
  } catch (e) {
    return {
      errorMessage: (e as Error).message,
    };
  }
}

async function traverseTracks(nextUrl: string): Promise<{ track: SpotifyTrack }[]> {
  console.info(`Fetching ${nextUrl}`);
  const response = await spotifyFetch<PlaylistResponse['tracks']>(nextUrl);

  console.log(response.total, response.items.length, response.offset);

  if (response.next == null) {
    return response.items;
  }

  return [...response.items, ...(await traverseTracks(response.next))];
}
