'use client';

import React, { ReactElement, startTransition } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import { TrackResult } from 'server/spotify/types';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addBangerAction } from '@/components/add-track/AddTrackActions';

import styles from './Swiper.module.css';

type Props = {
  track: TrackResult;
};

function Swiper({ track }: Props): ReactElement {
  return (
    <div className={styles.swiperRoot}>
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
          <div className="truncate text-lg mb-0">{track.name}</div>
          <div className="truncate text-sm -mt-1">by {track.artist}</div>
        </div>
        <Button variant="ghost" className={styles.no}>
          No thanks
        </Button>
        <Button
          variant="ghost"
          className={styles.yes}
          onClick={() => {
            startTransition(() => {
              addBangerAction(track.id)
                .then(() => {
                  toast.info('Added to your bangers!');
                })
                .catch((e) => {
                  console.error(e);
                  toast.error(`Unable to add ${track.name} right now. :(`);
                });
            });
          }}
        >
          Banger!
        </Button>
      </div>
    </div>
  );
}

export default Swiper;
