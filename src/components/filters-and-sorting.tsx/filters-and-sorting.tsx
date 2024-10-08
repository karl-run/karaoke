import { TrackResult } from '@/server/spotify/types'

import { ArtistFilter } from './artist-filter'
import { SortBy } from './sort-by'

type Props = {
  bangs: [string, TrackResult | null][]
}

export function FiltersAndSorting({ bangs }: Props) {
  return (
    <aside className="flex md:flex-col gap-4 w-270 md:items-start items-end">
      <SortBy />
      <ArtistFilter bangs={bangs} />
    </aside>
  )
}
