import React, { ReactElement, Suspense } from 'react'
import { notFound } from 'next/navigation'
import { unstable_noStore } from 'next/cache'
import { Metadata } from 'next'

import {
  getSpecialSongInGroup,
  WheelParamsSchema,
  WheelParams,
  getSpecialSongForSolo,
} from 'server/wheel/wheel-service'
import { getGroupForUser } from 'server/group/group-service'

import { FullPage } from '@/components/layout/Layouts'
import { Skeleton } from '@/components/ui/skeleton'
import ShowAfter5Seconds from '@/components/wheel/ShowAfter5Seconds'
import Wheel from '@/components/wheel/Wheel'
import { pickOne } from 'utils/random'

export const metadata: Metadata = {
  title: 'Karaoke Match - Spin the wheel!',
}

type Props = {
  params: {
    id: string
  }
  searchParams: unknown
}

function Page({ params, searchParams }: Props): ReactElement {
  unstable_noStore()

  const verifiedParams = WheelParamsSchema.parse(searchParams)

  return (
    <FullPage
      title="Which song will it be?"
      back={{
        to: `/groups/${params.id}/wheel`,
        text: 'Back to wheel type',
      }}
    >
      <Suspense fallback={<WheelSkeleton />}>
        <WheelWithData groupId={params.id} params={verifiedParams} />
      </Suspense>
    </FullPage>
  )
}

async function WheelWithData({ groupId, params }: { groupId: string; params: WheelParams }): Promise<ReactElement> {
  const userGroup = await getGroupForUser(groupId)

  if ('error' in userGroup) {
    console.warn(userGroup.error)
    notFound()
  }

  if (params.type === 'solo') {
    const user = params.luckyUser === 'random' ? pickOne(userGroup.group.users).safeId : params.luckyUser
    const [song, singer] = await getSpecialSongForSolo(groupId, user)

    if (song == null) {
      return (
        <Wheel skip>
          <div>
            <div className="flex justify-center items-center h-full w-full absolute text-3xl bg-black/70 rounded-lg">
              No song found!
            </div>
          </div>
        </Wheel>
      )
    }

    return (
      <Wheel>
        <ShowAfter5Seconds track={song}>
          <span className="italic">performed by {singer.name}</span>
        </ShowAfter5Seconds>
      </Wheel>
    )
  }

  // TODO: This is in-implemented:
  const selectedSong = await getSpecialSongInGroup(groupId, params)
  return (
    <div>
      <Wheel>
        <ShowAfter5Seconds track={selectedSong!} />
      </Wheel>
    </div>
  )
}

function WheelSkeleton() {
  return (
    <div>
      <Skeleton className="h-full w-full max-w-full sm:max-w-prose aspect-square rounded-full" />
    </div>
  )
}

export default Page
