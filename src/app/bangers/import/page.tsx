import React, { ReactElement, Suspense } from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Metadata } from 'next'

import { getUser } from 'server/user/user-service'
import { isValidPlaylist } from 'server/spotify/playlist'

import { Skeleton } from '@/components/ui/skeleton'
import { SmallPage } from '@/components/layout/Layouts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ImportFromSpotify from '@/components/import-from-spotify/ImportFromSpotify'

export const metadata: Metadata = {
  title: 'Karaoke Match - Import (Spotify)',
}

type Props = {
  searchParams: Promise<{
    pid?: string
  }>
}

async function Page({ searchParams }: Props): Promise<ReactElement> {
  const pid = (await searchParams).pid

  return (
    <SmallPage
      title="Import from Spotify"
      back={{
        to: '/bangers',
        text: 'Back to bangers',
      }}
    >
      <Suspense
        fallback={
          <div className="p-4">
            <Skeleton className="h-20 w-1/2" />
          </div>
        }
      >
        <SpotifyImporter pid={pid} />
      </Suspense>
    </SmallPage>
  )
}

async function SpotifyImporter({ pid }: { pid?: string | null }) {
  const user = await getUser()

  if (!user) {
    return (
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>You have to be logged in to import playlists.</AlertTitle>
        <AlertDescription>
          <Link href="/login">Login</Link> to import playlists.
        </AlertDescription>
      </Alert>
    )
  }

  const playlistSize = pid && pid.length >= 20 ? await isValidPlaylist(pid) : null

  return (
    <div>
      <ImportFromSpotify validPlaylistSongCount={playlistSize} />
    </div>
  )
}

export default Page
