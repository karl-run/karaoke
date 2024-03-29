import { getSpotifyToken } from "@/spotify/auth";
import { Image, SpotifyTracksResponse } from "@/spotify/types";

type TrackResult = {
  id: string;
  name: string;
  artist: string;
  spotify_url: string;
  preview_url?: string;
  image: Image;
};

export async function search(
  search: string,
  type: "track" | "artist" | "album",
) {
  const result = await spotifyFetch<SpotifyTracksResponse>(
    `/v1/search?q=${buildSearchQuery(search)}&type=${type}`,
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

const SPOTIFY_BASE_URL = `https://api.spotify.com`;

async function spotifyFetch<Response>(path: string): Promise<Response> {
  const token = await getSpotifyToken();

  console.info("Fetching Spotify API: ", `${SPOTIFY_BASE_URL}/${path}`);

  const response = await fetch(`${SPOTIFY_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify HTTP error! status: ${response.status}, ${text}`);
  }

  return response.json();
}
