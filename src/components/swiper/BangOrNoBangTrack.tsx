import Image from 'next/image';
import React from 'react';
import { StarFilledIcon } from '@radix-ui/react-icons';

import { TrackResult } from 'server/spotify/types';

import { cn } from '@/lib/utils';
import PlaySong from '@/components/PlaySong';
import { Button } from '@/components/ui/button';

import styles from './BangOrNoBangTrack.module.css';

type Props = {
  className?: string;
  track: TrackResult;
  suggestedBy: string[];
  autoplay: boolean;
  disabled: boolean;
  onBanger: () => void;
  onDismiss: () => void;
};

export function BangOrNoBangTrack({ className, track, suggestedBy, disabled, autoplay, onBanger, onDismiss }: Props) {
  return (
    <div className={cn(className, styles.trackGrid)}>
      {suggestedBy.includes('global') ? (
        <div className="absolute top-4 right-4">
          <StarFilledIcon className={cn('h-6 w-6 stroke-1 stroke-gray-500 text-gray-300')} />
        </div>
      ) : (
        <div className="absolute top-4 right-4">
          <StarFilledIcon
            className={cn('h-6 w-6 stroke-1 absolute', {
              'stroke-amber-400 text-amber-300': true,
            })}
          />
          <StarFilledIcon
            className={cn('h-6 w-6 stroke-1', {
              'stroke-amber-400 text-amber-300 animate-ping': true,
            })}
          />
        </div>
      )}
      <Button asChild variant="ghost" size="sm" className="absolute top-4 left-4">
        <a href={track.spotify_url} target="_blank" rel="noreferrer">
          Open in spotify
        </a>
      </Button>
      <Image
        unoptimized
        className={cn(styles.albumArt, 'pointer-events-none')}
        src={track.image.url}
        alt={track.name}
        width={200}
        height={200}
      />
      <div className={styles.description}>
        <div className={styles.trackName}>{track.name}</div>
        <div className={styles.trackArtist}>by {track.artist}</div>
        {track.preview_url && !disabled && (
          <div className={styles.trackPreviewButton}>
            <PlaySong songId={track.id} previewUrl={track.preview_url} autoplay={autoplay} />
          </div>
        )}
      </div>
      <Button variant="ghost" className={styles.no} onClick={onDismiss} disabled={disabled}>
        No thanks
      </Button>
      <Button variant="ghost" className={styles.yes} onClick={onBanger} disabled={disabled}>
        Banger!
      </Button>
    </div>
  );
}
