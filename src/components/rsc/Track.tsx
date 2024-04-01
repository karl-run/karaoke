import React, { ReactElement } from 'react';
import Image from 'next/image';
import PlaySong from '@/components/PlaySong';
import { TrackResult } from '@/spotify/types';
import AddTrack from '@/components/AddTrack';
import RemoveTrack from '@/components/RemoveTrack';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import styles from './Track.module.css';
import { CheckIcon } from '@radix-ui/react-icons';

type Props = {
  track: TrackResult;
  action: 'addable' | 'removable' | 'already-added' | 'none';
};

function Track({ track, action }: Props): ReactElement {
  return (
    <div className={styles.trackGrid}>
      <Image
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
          <p className="hidden xs:block opacity-70">Already in your bangers</p>
        </div>
      )}
    </div>
  );
}

export function TrackSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-square max-w-full" />
      <div className="flex items-center p-1 gap-1">
        <div className="grow flex flex-col gap-1">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}

export default Track;
