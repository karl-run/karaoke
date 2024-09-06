import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs'
import { useMemo } from 'react'

import { TrackResult } from '@/server/spotify/types'

export const useFilterAndSort = (bangs: [string, TrackResult | null][]) => {
  const [search] = useQueryState('sort')
  const [filter] = useQueryState('filter', parseAsArrayOf(parseAsString))

  const filtered = useMemo(() => {
    if (filter == null || filter.length === 0) return bangs

    return bangs.filter(([, track]) => track !== null && !filter.some((f) => encodeURIComponent(track.artist) === f))
  }, [bangs, filter])

  const sorted = useMemo(() => {
    if (search === 'date-added') {
      return filtered
    }

    return filtered.toSorted((a, b) => {
      if (search === 'song-name') {
        const songA = a[1]?.name ?? ''
        const songB = b[1]?.name ?? ''

        return songA.localeCompare(songB)
      }

      const artistA = a[1]?.artist ?? ''
      const artistB = b[1]?.artist ?? ''

      return artistA.localeCompare(artistB)
    })
  }, [search, filtered])

  return sorted
}
