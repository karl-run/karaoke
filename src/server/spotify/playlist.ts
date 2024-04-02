import { spotifyFetch } from 'server/spotify/auth';
import { SpotifyTrack } from 'server/spotify/types';
import { spotifyTrackToTrackResult } from 'server/spotify/mapper';

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