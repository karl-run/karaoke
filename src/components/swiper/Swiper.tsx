'use client';

import React, { PropsWithChildren, ReactElement, startTransition, useState } from 'react';
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
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

import { TrackResult } from 'server/spotify/types';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addBangerAction } from '@/components/add-track/AddTrackActions';
import PlaySong from '@/components/PlaySong';

import styles from './Swiper.module.css';

type Props = {
  suggestions: TrackResult[];
};

function Swiper({ suggestions }: Props): ReactElement {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const stack = suggestions.filter((track) => !completedIds.includes(track.id)).reverse();

  return (
    <div className={styles.swiperRootRoot}>
      {stack.map((track, index) => (
        <SwipeDragContext
          key={track.id}
          onBang={() => {
            setCompletedIds((ids) => [...ids, track.id]);

            toast.success(`${track.name} added!`);
          }}
          onDismiss={() => {
            setCompletedIds((ids) => [...ids, track.id]);

            toast.info(`${track.name} dismissed!`);
          }}
        >
          <DraggableTrack track={track} className="absolute" autoplay={index === stack.length - 1} />
        </SwipeDragContext>
      ))}
    </div>
  );
}

type DraggableTrackProps = {
  className?: string;
  track: TrackResult;
  autoplay: boolean;
};

function DraggableTrack({ className, track, autoplay }: DraggableTrackProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${Math.pow(transform.x / 50, 2) * 2}px, 0)`,
      }
    : undefined;

  const meta = transform ? dragMeta(transform) : null;

  return (
    <div className={cn(className, styles.swiperRoot)} ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {autoplay ? 'auto' : 'manual'}
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
            meta != null && meta?.percent > 0
              ? {
                  display: 'flex',
                  opacity: meta.percent,
                }
              : undefined
          }
        >
          <div style={meta ? { transform: `translateY(-${meta.percent * 100}%)` } : undefined} className="relative">
            Banger!
            {meta?.enough && (
              <div className="absolute top-20 w-full flex justify-center">
                <CheckIcon className="h-32 w-32 text-green-50" />
              </div>
            )}
          </div>
        </div>
        <div
          className={styles.notBangerNotification}
          style={
            meta != null && meta.percent < 0
              ? {
                  display: 'flex',
                  opacity: Math.abs(meta.percent),
                }
              : undefined
          }
        >
          <div
            style={meta ? { transform: `translateY(-${(Math.abs(meta.percent) - 0.1) * 100}%)` } : undefined}
            className="relative"
          >
            No thanks
            {meta?.enough && (
              <div className="absolute top-20 w-full flex justify-center">
                <Cross2Icon className="h-32 w-32 text-green-50" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SwipeDragContext({
  children,
  onDismiss,
  onBang,
}: PropsWithChildren<{
  onDismiss: () => void;
  onBang: () => void;
}>) {
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
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      sensors={sensors}
      onDragEnd={(event) => {
        const meta = dragMeta(event.delta);
        if (meta.enough) {
          if (meta.direction === 'right') {
            onBang();
          } else {
            onDismiss();
          }
        }
      }}
    >
      {children}
    </DndContext>
  );
}

function dragMeta(transform: { x: number }): {
  percent: number;
  enough: boolean;
  direction: 'left' | 'right';
} {
  const maxWidth = window.innerWidth < 732 ? 732 : window.innerWidth;
  const dragPercent = transform
    ? transform.x > 0
      ? Math.min(transform.x / (maxWidth * 0.1), 1)
      : -Math.min(Math.abs(transform.x) / (maxWidth * 0.1), 1)
    : 0;

  return {
    percent: dragPercent,
    enough: Math.abs(dragPercent) > 0.5,
    direction: transform.x > 0 ? 'right' : 'left',
  };
}

export default Swiper;
