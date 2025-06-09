export interface SpotifyTracksResponse {
  tracks: SpotifyTracksPagination
}

export interface SpotifyTracksPagination {
  href: string
  items: SpotifyTrack[]
  limit: number
  next: string
  offset: number
  previous: any
  total: number
}

export interface SpotifyTrack {
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: SpotifyExternalIds
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url?: string
  track_number: number
  type: string
  uri: string
}

export interface SpotifyAlbum {
  album_type: string
  artists: AlbumArtist[]
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface AlbumArtist {
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface SpotifyExternalUrls {
  spotify: string
}

export interface SpotifyExternalIds {
  isrc: string
}

export interface Image {
  height: number
  url: string
  width: number
}

/**
 * @Deprecated Use `TrackFragment` from GraphQL instead.
 */
export type TrackResult = {
  id: string
  name: string
  artist: string
  spotify_url: string
  preview_url?: string
  image: Image
}
