import * as R from 'remeda'

import { TrackResult } from 'server/spotify/types'
import { addNormalizedIdToTrack } from 'server/spotify/mapper'

import { raise } from 'utils/ts'

const api = 'https://ws.audioscrobbler.com/2.0/'

function params(query: string): string {
  return new URLSearchParams({
    track: query,
    method: 'track.search',
    format: 'json',
    api_key: process.env.LAST_FM_API_KEY ?? raise("Can't search without last.fm API token"),
  }).toString()
}

export async function searchTracks(query: string): Promise<(TrackResult & { nid: string })[]> {
  const response = await fetch(`${api}?${params(query)}`)

  const body = await response.json()
  const tracks: RawTrackData[] = body.results.trackmatches.track

  return R.pipe(
    tracks,
    R.map(
      (it) =>
        ({
          id: it.mbid,
          name: it.name,
          artist: it.artist,
          spotify_url: it.url,
          preview_url: undefined,
          image: {
            url: R.last(it.image)?.['#text'] ?? '',
            height: 174,
            width: 174,
          },
        }) satisfies TrackResult,
    ),
    R.map(addNormalizedIdToTrack),
  )
}

type RawTrackData = {
  name: string
  artist: string
  url: string
  image: { '#text': string; size: string }[]
  mbid: string
}
