import { Metadata } from 'next'
import { ReactElement, Suspense } from 'react'

import { getUser } from 'server/user/user-service'

import BangersExtraActions from '@/components/bangers/BangersExtraActions'
import { Bangers } from '@/components/bangers/bangers'
import { FullPage, FullPageDescription } from '@/components/layout/Layouts'
import { TrackGridSkeleton } from '@/components/track/TrackGrid'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserBangersCached } from '@/server/bangers/bangers-service'

export const metadata: Metadata = {
  title: 'Karaoke Match - Bangers',
}

function Page(): ReactElement {
  return (
    <FullPage title="My bangers" back="search" actions={<BangersExtraActions />}>
      <Suspense
        fallback={
          <div className="container mx-auto p-4">
            <FullPageDescription className="flex items-center gap-1">
              You have <Skeleton className="h-4 w-6" /> bangers in your list!
            </FullPageDescription>
            <TrackGridSkeleton />
          </div>
        }
      >
        <BangersList />
      </Suspense>
    </FullPage>
  )
}

async function BangersList(): Promise<ReactElement> {
  const user = await getUser()
  if (!user) {
    return (
      <FullPageDescription className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Log in to see your bangers</div>
      </FullPageDescription>
    )
  }

  const bangs = await getUserBangersCached(user.userId)
  if (bangs.length === 0) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">No songs found</div>
        <p className="mt-8">Start adding bangers by searching for songs and adding them to your list.</p>
      </FullPageDescription>
    )
  }

  return <Bangers bangs={bangs} />
}

export default Page
