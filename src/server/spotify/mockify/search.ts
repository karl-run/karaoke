import { SpotifyTrack, SpotifyTracksResponse } from 'server/spotify/types'

import example from './search-example.json'

export function mockSearch(params: URLSearchParams): SpotifyTracksResponse {
  console.info('Mocking search with params, returning westlife anyway', params)

  return example
}

export function mockTrackLookup(trackId: string): SpotifyTrack {
  console.info('Mocking track lookup with id', trackId)

  const track = example.tracks.items.find((t) => t.id === trackId)

  if (track) {
    return track
  }

  throw new Error(`Track with id ${trackId} not found`)
}
