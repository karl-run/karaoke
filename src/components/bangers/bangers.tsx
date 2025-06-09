'use client'

import { useQuery } from '@apollo/client'

import { AllUserBangersDocument } from '@/graphql/graphql-operations'
import { Skeleton } from '@/components/ui/skeleton'
import { isUserNotLoggedIn } from '@/graphql/server/errors'

import { FiltersAndSorting } from '../filters-and-sorting.tsx/filters-and-sorting'
import { useFilterAndSort } from '../filters-and-sorting.tsx/use-filter-and-sort'
import { FullPageDescription } from '../layout/Layouts'
import Track, { MissingTrack } from '../track/Track'
import { TrackGrid, TrackGridSkeleton } from '../track/TrackGrid'

export function Bangers() {
  const bangersQuery = useQuery(AllUserBangersDocument, {})
  const filtered = useFilterAndSort(bangersQuery.data?.bangers ?? [])

  if (bangersQuery.loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-[min-content_auto]">
          <div>
            <FullPageDescription className="flex items-center gap-1">
              You have <Skeleton className="h-4 w-6" /> bangers in your list!
            </FullPageDescription>
            <TrackGridSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (bangersQuery.error) {
    if (isUserNotLoggedIn(bangersQuery.error)) {
      return (
        <FullPageDescription className="p-20 flex justify-center items-center">
          <div className="text-xl opacity-70">Log in to see your bangers</div>
        </FullPageDescription>
      )
    }

    return (
      <FullPageDescription className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Error loading bangers: {bangersQuery.error.message}</div>
      </FullPageDescription>
    )
  }

  if (bangersQuery.data?.bangers == null || bangersQuery.data.bangers.length === 0) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">No songs found</div>
        <p className="mt-8">Start adding bangers by searching for songs and adding them to your list.</p>
      </FullPageDescription>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[min-content_auto]">
        <FiltersAndSorting bangs={bangersQuery.data.bangers} />

        <div>
          <FullPageDescription>
            Showing {filtered.length} of your {bangersQuery.data.bangers.length} total bangers!
          </FullPageDescription>
          <TrackGrid>
            {filtered.map((track, index) => (
              <div key={track?.id ?? index}>
                {track != null ? <Track track={track} action="removable" /> : <MissingTrack />}
              </div>
            ))}
          </TrackGrid>
        </div>
      </div>
    </div>
  )
}
