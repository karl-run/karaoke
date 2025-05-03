import React, { ReactElement, Suspense } from 'react'
import { Metadata } from 'next'

import { getPlaylistWithTracks } from 'server/spotify/playlist'
import { getUserBangersRecord } from 'server/bangers/bangers-service'
import { getUser } from 'server/user/user-service'

import { FullPage, FullPageDescription } from '@/components/layout/Layouts'
import { TrackGrid, TrackGridSkeleton } from '@/components/track/TrackGrid'
import Track from '@/components/track/Track'

export const metadata: Metadata = {
  title: 'Karaoke Match - Playlist',
}

type Props = {
  params: Promise<{
    pid: string
  }>
}

async function Page({ params }: Props): Promise<ReactElement> {
  const { pid } = await params

  return (
    <FullPage title="Spotify playlist" back={{ text: 'Back to home', to: '/' }}>
      <Suspense fallback={<TrackGridSkeleton />}>
        <Playlist playlistId={pid} />
      </Suspense>
    </FullPage>
  )
}

async function Playlist({ playlistId }: { playlistId: string }): Promise<ReactElement> {
  const [playlist, userTracks] = await Promise.all([
    getPlaylistWithTracks(playlistId),
    getUser().then((it) => (it ? getUserBangersRecord(it.userId) : null)),
  ])

  if ('errorMessage' in playlist) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">Error fetching playlist</div>
        <p className="mt-8">{playlist.errorMessage}</p>
      </FullPageDescription>
    )
  }

  if (playlist.tracks.length === 0) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">No songs in playlist found</div>
        <p className="mt-8">Make sure the linked playlist contains songs!</p>
      </FullPageDescription>
    )
  }

  return (
    <>
      <FullPageDescription>
        {playlist.name} by {playlist.owner}
      </FullPageDescription>
      <TrackGrid>
        {playlist.tracks.map((track) => (
          <div key={track.id}>
            <Track track={track} action={userTracks?.[track.id] != null ? 'already-added' : 'addable'} />
          </div>
        ))}
      </TrackGrid>
    </>
  )
}

export default Page
