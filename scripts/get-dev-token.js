import { getSpotifyToken } from "@/spotify/auth";

delete process.env.SPOTIFY_DEV_TOKEN;

const token = await getSpotifyToken();

console.log(token);
