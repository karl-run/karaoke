import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ReactElement, Suspense } from 'react'

import { getUserBangers, getUserBangersRecord } from 'server/bangers/bangers-service'
import { getOtherUser, getUser, usersShareGroup } from 'server/user/user-service'

import { GroupMemberBangersLoaded } from '@/components/group-member-bangers/group-member-bangers'
import { FullPage, FullPageDescription } from '@/components/layout/Layouts'
import { TrackGridSkeleton } from '@/components/track/TrackGrid'
import { Skeleton } from '@/components/ui/skeleton'
import { SortBy } from '@/components/filters-and-sorting.tsx/sort-by'

export const metadata: Metadata = {
  title: 'Karaoke Match - Friend',
}

type Props = {
  params: {
    userId: string
  }
  searchParams: {
    returnTo: string
  }
}

function Page({ params, searchParams }: Props): ReactElement {
  return (
    <FullPage
      title={`Bangers for this absolute ${getRandomGoodWord()}`}
      back={
        searchParams.returnTo
          ? {
              to: `/groups/${searchParams.returnTo}`,
              text: 'Back to group',
            }
          : {
              to: '/groups',
              text: 'Back to groups',
            }
      }
    >
      <Suspense
        fallback={
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-[min-content_auto]">
              <SortBy />

              <div>
                <GroupMemberBangersSkeleton />
              </div>
            </div>
          </div>
        }
      >
        <GroupMemberBangers userSafeId={params.userId} />
      </Suspense>
    </FullPage>
  )
}

async function GroupMemberBangers({ userSafeId }: { userSafeId: string }) {
  const [user, otherUser] = await Promise.all([getUser(), getOtherUser(userSafeId)])
  if (!user || !otherUser) {
    notFound()
  }

  if (user.userId === otherUser.userId) {
    // User looking ot their own bangers
    redirect('/bangers')
  }

  if (!(await usersShareGroup(user.userId, otherUser.userId))) {
    console.error('User does not share group with group member, sneaky!')
    notFound()
  }

  const [otherUserBangers, userCache] = await Promise.all([
    getUserBangers(otherUser.userId),
    getUserBangersRecord(user.userId),
  ])

  return <GroupMemberBangersLoaded otherUserBangers={otherUserBangers} name={otherUser.name} userCache={userCache} />
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

function getRandomGoodWord() {
  const goodWords = ['legend', 'champion', 'hero', 'master', 'genius']
  return goodWords[Math.floor(Math.random() * goodWords.length)]
}

export default Page
