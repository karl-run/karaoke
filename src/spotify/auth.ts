const SPOTIFY_BASE_URL = `https://api.spotify.com`;

export async function getSpotifyToken(): Promise<string> {
  if (process.env.SPOTIFY_DEV_TOKEN != null) {
    return process.env.SPOTIFY_DEV_TOKEN;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify HTTP error! status: ${response.status}, ${text}`);
  }

  const result: {
    access_token: string;
    token_type: string;
    expires_in: number;
  } = await response.json();

  return result.access_token;
}

export async function spotifyFetch<Response>(path: string): Promise<Response> {
  const token = await getSpotifyToken();

  console.info('Fetching Spotify API: ', `${SPOTIFY_BASE_URL}${path}`);

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
    throw new Error(`Spotify HTTP error! Status: ${response.status} ${response.statusText}`, {
      cause: new Error(text),
    });
  }

  return response.json();
}
