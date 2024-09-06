'use client'

import { TrackResult } from '@/server/spotify/types'

import { FiltersAndSorting } from '../filters-and-sorting.tsx/filters-and-sorting'
import { useFilterAndSort } from '../filters-and-sorting.tsx/use-filter-and-sort'
import { FullPageDescription } from '../layout/Layouts'
import Track, { MissingTrack } from '../track/Track'
import { TrackGrid } from '../track/TrackGrid'

type Props = {
  otherUserBangers: [string, TrackResult | null][]
  name: string
  userCache: Record<string, TrackResult | null>
}

export function GroupMemberBangersLoaded({ otherUserBangers, name, userCache }: Props) {
  const filtered = useFilterAndSort(otherUserBangers)

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[min-content_auto]">
        <FiltersAndSorting bangs={otherUserBangers} />

        <div>
          <FullPageDescription>
            Showing {filtered.length} of the {otherUserBangers.length} bangers that belong to{' '}
            <span className="font-bold">{name}</span>!
          </FullPageDescription>
          <TrackGrid>
            {filtered.map(([trackId, track]) =>
              track != null ? (
                <Track key={trackId} track={track} action={userCache[trackId] != null ? 'already-added' : 'addable'} />
              ) : (
                <MissingTrack key={trackId} />
              ),
            )}
          </TrackGrid>
        </div>
      </div>
    </div>
  )
}
