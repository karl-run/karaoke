import * as R from 'remeda'
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs'
import { useMemo } from 'react'

import { TrackFragment } from '@/graphql/graphql-operations'

export const useFilterAndSort = (bangs: (TrackFragment | null)[]) => {
  const [search] = useQueryState('sort')
  const [filter] = useQueryState('filter', parseAsArrayOf(parseAsString))

  const filtered = useMemo(() => {
    if (filter == null || filter.length === 0) return bangs

    return bangs.filter(R.isNonNull).filter((track) => !filter.some((f) => encodeURIComponent(track.artist) === f))
  }, [bangs, filter])

  const sorted = useMemo(() => {
    if (search === 'date-added') {
      return filtered
    }

    return filtered.toSorted((a, b) => {
      if (search === 'song-name') {
        const songA = a?.name ?? ''
        const songB = b?.name ?? ''

        return songA.localeCompare(songB)
      }

      const artistA = a?.artist ?? ''
      const artistB = b?.artist ?? ''

      return artistA.localeCompare(artistB)
    })
  }, [search, filtered])

  return sorted
}
