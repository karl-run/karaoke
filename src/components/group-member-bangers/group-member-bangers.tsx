'use client'

import * as R from 'remeda'
import { useQuery } from '@apollo/client'
import { useMemo } from 'react'

import { AllUserBangersDocument, OtherUserBangersDocument } from '@/graphql/graphql-operations'
import { Skeleton } from '@/components/ui/skeleton'

import { FiltersAndSorting } from '../filters-and-sorting.tsx/filters-and-sorting'
import { useFilterAndSort } from '../filters-and-sorting.tsx/use-filter-and-sort'
import { FullPageDescription } from '../layout/Layouts'
import Track, { MissingTrack } from '../track/Track'
import { TrackGrid, TrackGridSkeleton } from '../track/TrackGrid'

type Props = {
  safeId: string
}

export function GroupMemberBangers({ safeId }: Props) {
  const currentUsersBangers = useQuery(AllUserBangersDocument)
  const groupMemberBangersQuery = useQuery(OtherUserBangersDocument, {
    variables: { safeId },
  })

  const userCache = useMemo(
    () => currentUsersBangers.data?.bangers?.map((it) => it?.id).filter(R.isTruthy) ?? [],
    [currentUsersBangers.data?.bangers],
  )
  const otherUserBangers = groupMemberBangersQuery.data?.otherUser?.bangers ?? []
  const filtered = useFilterAndSort(otherUserBangers)

  if (groupMemberBangersQuery.loading || currentUsersBangers.loading) {
    return <GroupMemberBangersSkeleton />
  }

  if (groupMemberBangersQuery.error) {
    return (
      <FullPageDescription className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Error loading bangers: {groupMemberBangersQuery.error.message}</div>
      </FullPageDescription>
    )
  }

  if (currentUsersBangers.error) {
    return (
      <FullPageDescription className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Error loading your bangers to compare to this users bangers.</div>
      </FullPageDescription>
    )
  }

  if (
    !groupMemberBangersQuery.data?.otherUser?.bangers ||
    groupMemberBangersQuery.data.otherUser.bangers.length === 0
  ) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">No bangers found for this user.</div>
        <p className="mt-8">This user may not have added any bangers yet.</p>
      </FullPageDescription>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[min-content_auto]">
        <FiltersAndSorting bangs={otherUserBangers} />

        <div>
          <FullPageDescription>
            Showing {filtered.length} of the {otherUserBangers.length} bangers that belong to{' '}
            <span className="font-bold">{groupMemberBangersQuery.data.otherUser.name}</span>!
          </FullPageDescription>
          <TrackGrid>
            {filtered.map((track, index) =>
              track != null ? (
                <Track
                  key={track.id}
                  track={track}
                  action={userCache.includes(track.id) != null ? 'already-added' : 'addable'}
                />
              ) : (
                <MissingTrack key={index} />
              ),
            )}
          </TrackGrid>
        </div>
      </div>
    </div>
  )
}

function GroupMemberBangersSkeleton() {
  return (
    <>
      <FullPageDescription>
        <Skeleton className="h-4 w-20" />
      </FullPageDescription>
      <TrackGridSkeleton />
    </>
  )
}
