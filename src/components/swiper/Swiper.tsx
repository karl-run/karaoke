'use client';

import React, { ReactElement, startTransition } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { TrackResult } from 'server/spotify/types';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addBangerAction } from '@/components/add-track/AddTrackActions';

import styles from './Swiper.module.css';

type Props = {
  track: TrackResult;
};

function Swiper({ track }: Props): ReactElement {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(pointerSensor, keyboardSensor, mouseSensor, touchSensor);

  return (
    <DndContext modifiers={[restrictToHorizontalAxis]} sensors={sensors}>
      <DraggableTrack track={track} />
    </DndContext>
  );
}

function DraggableTrack({ track }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${Math.pow(transform.x / 50, 2) * 2}px, 0)`,
      }
    : undefined;

  const isDragging = transform != null;
  // if screen less than 732px, use 732px as the max width
  // Moving 20% of total screen width should yield a drag percent of 1
  const maxWidth = window.innerWidth < 732 ? 732 : window.innerWidth;
  const dragPercent = transform
    ? transform.x > 0
      ? Math.min(transform.x / (maxWidth * 0.1), 1)
      : -Math.min(Math.abs(transform.x) / (maxWidth * 0.1), 1)
    : 0;

  return (
    <div className={styles.swiperRoot} ref={setNodeRef} {...listeners} {...attributes} style={style}>
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
        <div
          className={styles.bangerNotification}
          style={
            isDragging && dragPercent > 0
              ? {
                  display: isDragging ? 'flex' : 'none',
                  opacity: isDragging ? dragPercent : 0,
                }
              : undefined
          }
        >
          <div
            style={{
              transform: `translateY(-${(dragPercent - 0.1) * 100}%)`,
            }}
          >
            Banger!
          </div>
        </div>
        <div
          className={styles.notBangerNotification}
          style={
            isDragging && dragPercent < 0
              ? {
                  display: isDragging ? 'flex' : 'none',
                  opacity: isDragging ? Math.abs(dragPercent) : 0,
                }
              : undefined
          }
        >
          <div
            style={{
              transform: `translateY(-${(Math.abs(dragPercent) - 0.1) * 100}%)`,
            }}
          >
            No thanks
          </div>
        </div>
        {dragPercent}
      </div>
    </div>
  );
}

export default Swiper;
