import { spotifyFetch } from 'server/spotify/auth'
import { SpotifyTrack, TrackResult } from 'server/spotify/types'
import { spotifyTrackToTrackResult } from 'server/spotify/mapper'

type PlaylistResponse = {
  name: string
  owner: {
    display_name: string
  }
  tracks: {
    offset: number
    total: number
    next: string
    items: { track: SpotifyTrack }[]
  }
}

export async function getPlaylistWithTracks(playlistId: string): Promise<
  | {
      name: string
      owner: string
      tracks: TrackResult[]
    }
  | { errorMessage: string }
> {
  try {
    const playlist = await spotifyFetch<PlaylistResponse>(`/v1/playlists/${playlistId}`)
    const restOfTracks = playlist.tracks.next ? await traverseTracks(playlist.tracks.next) : []

    const tracks = [...playlist.tracks.items, ...restOfTracks]
      .map((item) => item.track)
      .map(spotifyTrackToTrackResult)
      // Remove weird empty track?!
      .filter((it) => it.name !== '')

    return {
      name: playlist.name,
      owner: playlist.owner.display_name,
      tracks,
    }
  } catch (e) {
    return {
      errorMessage: (e as Error).message,
    }
  }
}

export async function isValidPlaylist(playlistId: string): Promise<number | null> {
  try {
    const playlist = await spotifyFetch<PlaylistResponse>(`/v1/playlists/${playlistId}`)

    return playlist.tracks.total
  } catch (e) {
    console.warn(`Playlist was not valid, spotify says: ${e}`)
    return null
  }
}

async function traverseTracks(nextUrl: string): Promise<{ track: SpotifyTrack }[]> {
  const response = await spotifyFetch<PlaylistResponse['tracks']>(nextUrl)

  if (response.next == null) {
    return response.items
  }

  return [...response.items, ...(await traverseTracks(response.next))]
}
