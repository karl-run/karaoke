import React, { ReactElement } from 'react'
import Image from 'next/image'
import { CheckIcon } from '@radix-ui/react-icons'

import { TrackResult } from 'server/spotify/types'
import { getTrack } from 'server/spotify/track'

import PlaySong from '@/components/PlaySong'
import AddTrack from '@/components/add-track/AddTrack'
import RemoveTrack from '@/components/RemoveTrack'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import styles from './Track.module.css'

type Props = {
  track: TrackResult
  action: 'addable' | 'removable' | 'already-added' | 'none'
}

function Track({ track, action }: Props): ReactElement {
  return (
    <div className={styles.trackGrid}>
      <Image
        unoptimized
        className={cn(styles.image, {
          'opacity-30': action === 'already-added',
        })}
        src={track.image.url}
        alt={track.name}
        width={200}
        height={200}
      />
      <div className={styles.name} title={track.name}>
        {track.name}
      </div>
      <div className={styles.artist} title={track.artist}>
        {track.artist}
      </div>
      {track.preview_url && (
        <div className={styles.previewPlay}>
          <PlaySong songId={track.id} previewUrl={track.preview_url} />
        </div>
      )}
      {action === 'addable' && (
        <AddTrack className={styles.interactive} id={track.id} shortname={`${track.name} - ${track.artist}`} />
      )}
      {action === 'removable' && (
        <RemoveTrack className={styles.interactive} id={track.id} shortname={`${track.name} - ${track.artist}`} />
      )}
      {action === 'already-added' && (
        <div className={cn(styles.interactive, 'flex flex-col justify-center items-center')}>
          <CheckIcon className={cn('h-full w-full xs:h-1/2 xs:w-1/2')} />
          <p className="hidden xs:block opacity-70 text-center px-2">Already in your bangers</p>
        </div>
      )}
    </div>
  )
}

export async function LazyTrack({
  trackId,
  action,
}: { trackId: string } & Pick<Props, 'action'>): Promise<ReactElement> {
  const track = await getTrack(trackId, true)

  return <Track track={track} action={action} />
}

export function TrackSkeleton() {
  return (
    <div className={styles.trackGrid}>
      <Skeleton className={styles.image} />
      <div className={styles.name}>
        <Skeleton className="h-5" />
      </div>
      <div className={styles.artist}>
        <Skeleton className="h-5" />
      </div>
      <div className={styles.interactive}>
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
}

export default Track
