import { SpotifyTrack, TrackResult } from 'server/spotify/types';

export function spotifyTrackToTrackResult(track: SpotifyTrack): TrackResult {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    spotify_url: track.external_urls.spotify,
    preview_url: track.preview_url,
    image: track.album.images[0],
  } satisfies TrackResult;
}
