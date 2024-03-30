import { spotifyFetch } from "@/spotify/auth";
import {
  SpotifyTrack,
  SpotifyTracksResponse,
  TrackResult,
} from "@/spotify/types";
import { addToCache, getCache } from "@/db/song-cache";

export async function getTrack(
  trackId: string,
  alsoCache: true,
): Promise<TrackResult> {
  const track = await spotifyFetch<SpotifyTrack>(`/v1/tracks/${trackId}`);

  const mapped = {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    spotify_url: track.external_urls.spotify,
    preview_url: track.preview_url,
    image: track.album.images[0],
  };

  if (alsoCache) {
    await addToCache(mapped);
  }

  return mapped;
}

export async function searchTracks(search: string) {
  const result = await spotifyFetch<SpotifyTracksResponse>(
    `/v1/search?q=${buildSearchQuery(search)}&type=track`,
  );

  return result.tracks.items.map(
    (track) =>
      ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        spotify_url: track.external_urls.spotify,
        preview_url: track.preview_url,
        image: track.album.images[0],
      }) satisfies TrackResult,
  );
}

function buildSearchQuery(search: string): string {
  return encodeURIComponent(search);
}
