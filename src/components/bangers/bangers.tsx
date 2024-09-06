'use client'

import { Suspense } from 'react'

import { TrackResult } from '@/server/spotify/types'

import { FiltersAndSorting } from '../filters-and-sorting.tsx/filters-and-sorting'
import { useFilterAndSort } from '../filters-and-sorting.tsx/use-filter-and-sort'
import { FullPageDescription } from '../layout/Layouts'
import Track, { LazyTrack, TrackSkeleton } from '../track/Track'
import { TrackGrid } from '../track/TrackGrid'

type Props = {
  bangs: [string, TrackResult | null][]
}

export function Bangers({ bangs }: Props) {
  const filtered = useFilterAndSort(bangs)

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[min-content_auto]">
        <FiltersAndSorting bangs={bangs} />

        <div>
          <FullPageDescription>
            Showing {filtered.length} of your {bangs.length} total bangers!
          </FullPageDescription>
          <TrackGrid>
            {filtered.map(([song_id, track]) => (
              <div key={song_id}>
                {track != null ? (
                  <Track track={track} action="removable" />
                ) : (
                  <Suspense fallback={<TrackSkeleton />}>
                    <LazyTrack trackId={song_id} action="removable" />
                  </Suspense>
                )}
              </div>
            ))}
          </TrackGrid>
        </div>
      </div>
    </div>
  )
}
