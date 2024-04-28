import Image from 'next/image';
import React from 'react';

import { TrackResult } from 'server/spotify/types';

import { cn } from '@/lib/utils';
import PlaySong from '@/components/PlaySong';
import { Button } from '@/components/ui/button';

import styles from './BangOrNoBangTrack.module.css';

type Props = {
  className?: string;
  track: TrackResult;
  autoplay: boolean;
  onBanger: () => void;
  onDismiss: () => void;
};

export function BangOrNoBangTrack({ className, track, autoplay, onBanger, onDismiss }: Props) {
  return (
    <div className={cn(className, styles.trackRoot)}>
      <div className={styles.trackGrid}>
        <Image
          unoptimized
          className={cn(styles.albumArt)}
          src={track.image.url}
          alt={track.name}
          width={200}
          height={200}
        />
        <div className={styles.description}>
          <div className={styles.trackName}>{track.name}</div>
          <div className={styles.trackArtist}>by {track.artist}</div>
          {track.preview_url && (
            <div className={styles.trackPreviewButton}>
              <PlaySong songId={track.id} previewUrl={track.preview_url} autoplay={autoplay} />
            </div>
          )}
        </div>
        <Button variant="ghost" className={styles.no} onClick={onDismiss}>
          No thanks
        </Button>
        <Button variant="ghost" className={styles.yes} onClick={onBanger}>
          Banger!
        </Button>
      </div>
    </div>
  );
}
