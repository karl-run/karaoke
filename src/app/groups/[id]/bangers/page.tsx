import * as R from 'remeda'
import { z } from 'zod'
import React, { ReactElement, Suspense } from 'react'
import Link from 'next/link'
import { Crosshair2Icon, GearIcon, StarFilledIcon } from '@radix-ui/react-icons'
import { MessageCircleWarningIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { getUser } from 'server/user/user-service'
import { getGroupById } from 'server/group/group-db'
import { getGroupBangers } from 'server/bangers/bangers-db'

import { FullPage, FullPageDescription, FullPageDetails } from '@/components/layout/Layouts'
import { TrackGrid, TrackGridSkeleton } from '@/components/track/TrackGrid'
import Track, { MissingTrack } from '@/components/track/Track'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import GroupAvatar from '@/components/avatar/GroupAvatar'
import GroupMembers from '@/components/group-members/GroupMembers'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Karaoke Match - Group Bangers',
}

type Props = {
  params: {
    id: string
  }
  searchParams: {
    // List of safeId of users that should be ignored from bangers
    ignored?: string
  }
}

const SearchParamsArraySchema = z.array(z.string())

function Page({ params: { id }, searchParams }: Props): ReactElement {
  const parsedParams = SearchParamsArraySchema.safeParse(searchParams.ignored?.split(',') ?? [])

  return (
    <FullPage
      title="Group bangers"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
      actions={
        <Button variant="outline" asChild>
          <Link href={`/groups/${id}/details`}>
            <GearIcon className="h-4 w-4 mr-2" />
            Group details
          </Link>
        </Button>
      }
    >
      <Suspense fallback={<GroupBangersSkeleton />}>
        <GroupBangers id={id} ignored={parsedParams.success ? parsedParams.data : []} />
      </Suspense>
    </FullPage>
  )
}

async function GroupBangers({ id, ignored }: { id: string; ignored: string[] }) {
  const [group, bangers, user] = await Promise.all([getGroupById(id), getGroupBangers(id, ignored), getUser()])

  if (!user) {
    notFound()
  }

  if (group == null || group.users.find((u) => u.userId === user?.userId) == null) {
    notFound()
  }

  const biggestBangerCount = R.firstBy(bangers, [(banger) => banger.userCount, 'desc'])?.userCount ?? 0

  return (
    <div>
      <FullPageDescription className="flex gap-3 mb-3 justify-between items-center">
        <div className="flex gap-3 items-center">
          <GroupAvatar iconIndex={group.iconIndex} />
          <div>
            <h1 className="text-lg">
              {bangers.length} certified bangers for {group.name}
            </h1>
            {ignored.length > 0 && <div className="text-xs">without {ignored.length} user(s)</div>}
          </div>
        </div>
        <Button variant="outline" className="mr-3 rounded-full w-10 h-10" asChild>
          <Link href={`/groups/${id}/wheel`} aria-label="Go to The Wheel" className="relative" prefetch={false}>
            <Crosshair2Icon className="h-4 w-4 absolute" />
            <Crosshair2Icon className="h-4 w-4 animate-ping absolute" />
          </Link>
        </Button>
      </FullPageDescription>
      <FullPageDetails>
        <GroupMembers
          members={R.pipe(
            group.users,
            R.sortBy([(it) => it.count, 'desc']),
            R.map((it) => ({ name: it.displayName, safeId: it.safeId, bangers: it.count })),
          )}
        />
      </FullPageDetails>

      {bangers.length === 0 && (
        <FullPageDetails>
          <Alert className="mt-4 max-w-prose">
            <MessageCircleWarningIcon className="h-4 w-4" />
            <AlertTitle>No bangers found?!</AlertTitle>
            <AlertDescription>
              Invite your friends, have them add their karaoke bangers! There has got to be at least one song you all
              share. :-)
            </AlertDescription>
          </Alert>
        </FullPageDetails>
      )}

      {bangers.length > 0 && (
        <TrackGrid>
          {bangers.map((banger) => (
            <div key={banger.songId} className="relative">
              <div className="text-xs ml-1 mb-0.5 truncate">{banger.users.join(', ')}</div>
              {banger.track != null ? <Track track={banger.track} action="none" /> : <MissingTrack />}
              <div className="absolute right-0 top-5 xs:top-6 xs:left-2 rounded-full w-6 h-6 flex items-center justify-center m-2">
                {banger.userCount === biggestBangerCount && biggestBangerCount > 2 ? (
                  <>
                    <StarFilledIcon className="h-10 w-10 text-yellow-500 absolute" />
                    <StarFilledIcon className="h-10 w-10 text-yellow-400 absolute animate-ping" />
                  </>
                ) : (
                  <div className="border min-w-7 min-h-7 bg-green-800/80 rounded-full" />
                )}
                <div className={'absolute text-white font-bold'}>{banger.userCount}</div>
              </div>
            </div>
          ))}
        </TrackGrid>
      )}
    </div>
  )
}

function GroupBangersSkeleton(): ReactElement {
  return (
    <div>
      <FullPageDescription className="flex gap-3 mb-3 justify-between items-center">
        <div className="flex gap-3 items-center">
          <Skeleton className="w-12 h-12" />
          <Skeleton className="w-80 h-6" />
        </div>
      </FullPageDescription>
      <FullPageDetails>
        <div className="mb-2">
          <div className="text-xs mb-1">Active members</div>
          <div className="flex w-full justify-start flex-wrap gap-1">
            <Skeleton className="flex flex-col h-14 min-w-20 w-1/3 xs:w-1/4 sm:w-auto grow sm:grow-0" />
            <Skeleton className="flex flex-col h-14 min-w-20 w-1/3 xs:w-1/4 sm:w-auto grow sm:grow-0" />
            <Skeleton className="flex flex-col h-14 min-w-20 w-1/3 xs:w-1/4 sm:w-auto grow sm:grow-0" />
            <Skeleton className="flex flex-col h-14 min-w-20 w-1/3 xs:w-1/4 sm:w-auto grow sm:grow-0" />
          </div>
        </div>
      </FullPageDetails>
      <TrackGridSkeleton />
    </div>
  )
}

export default Page
