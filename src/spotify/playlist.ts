import { spotifyFetch } from '@/spotify/auth';
import { SpotifyTrack } from '@/spotify/types';
import { spotifyTrackToTrackResult } from '@/spotify/mapper';

type PlaylistResponse = {
  tracks: {
    items: { track: SpotifyTrack }[];
  };
};

export async function getTracksInPlaylist(playlistId: string) {
  try {
    const playlist = await spotifyFetch<PlaylistResponse>(`/v1/playlists/${playlistId}`);

    return playlist.tracks.items.map((item) => item.track).map(spotifyTrackToTrackResult);
  } catch (e) {
    return {
      errorMessage: (e as Error).message,
    };
  }
}

console.log(await getTracksInPlaylist('37i9dQZF1DXcBWIGoYBM5M'));
