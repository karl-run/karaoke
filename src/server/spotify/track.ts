import { spotifyFetch } from 'server/spotify/auth';
import { SpotifyTrack, SpotifyTracksResponse, TrackResult } from 'server/spotify/types';
import { spotifyTrackToTrackResult } from 'server/spotify/mapper';
import {addToCache} from "server/bangers/bangers-cache";

export async function getTrack(trackId: string, alsoCache: true): Promise<TrackResult> {
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
  const result = await spotifyFetch<SpotifyTracksResponse>(`/v1/search?q=${buildSearchQuery(search)}&type=track`);

  return result.tracks.items.map(spotifyTrackToTrackResult);
}

export async function bestGuessTrack(search: string): Promise<TrackResult | null> {
  const tracks = await searchTracks(search);

  if (tracks.length === 0) {
    return null;
  }

  await addToCache(tracks[0]);

  return tracks[0] ?? null;
}

function buildSearchQuery(search: string): string {
  return encodeURIComponent(search);
}