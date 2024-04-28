'use client';

import React, { ReactElement, startTransition, useRef, useState } from 'react';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { animated, to as interpolate, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { toast } from 'sonner';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { TrackResult } from 'server/spotify/types';

import { BangOrNoBangTrack } from '@/components/swiper/BangOrNoBangTrack';
import { addBangerAction } from '@/components/add-track/AddTrackActions';
import { SwiperLanding } from '@/components/swiper/SwiperLanding';

import { from, hasMovedEnough, scaleFn, to } from './SwiperAnimationUtils';
import styles from './Swiper.module.css';

type Props = {
  suggestions: TrackResult[];
};

const YEET_DISTANCE = 200;

function Swiper({ suggestions }: Props): ReactElement {
  const completedMountAnimations = useRef(0);
  const [stackInitiated, setStackInitiated] = useState<boolean>(false);

  const [autoplayDisabled] = useQueryState('no-auto', parseAsBoolean.withDefault(false));
  const maxWidth = Math.min(window.innerWidth, 520) + Math.min(window.innerWidth, 520) / 2;

  const [topDeckIndex, setTopDeckIndex] = useState<number>(24);
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(suggestions.length, (i) => ({
    from: from(i, maxWidth),
  }));

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity: [velocity] }) => {
    const trigger = velocity > 0.2 || hasMovedEnough(mx, maxWidth);
    const direction = xDir !== 0 ? (xDir < 0 ? -1 : 1) : mx < 0 ? -1 : 1;

    if (!down && trigger) {
      if (direction === 1) {
        bangTrack(index, suggestions[index].id, suggestions[index].name);
      } else {
        dismissTrack(index, suggestions[index].id, suggestions[index].name);
      }
      return;
    }

    api.start((i) => {
      if (index !== i) return;

      const isGone = gone.has(index);
      const x = isGone ? (maxWidth + YEET_DISTANCE) * direction : down ? mx : 0;

      return {
        x,
        scale: down ? 1.025 : 1,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
  });

  const initStack = () => {
    api.start((i) => ({
      ...to(i),
      onRest: () => {
        completedMountAnimations.current += 1;
        if (completedMountAnimations.current === suggestions.length) {
          setStackInitiated(true);
        }
      },
    }));
  };

  const bangTrack = (index: number, trackId: string, name: string) => {
    gone.add(index);
    setTopDeckIndex(index - 1);
    toast.info(`Banged ${name}!`, { duration: 1000 });

    startTransition(() => {
      addBangerAction(trackId).catch((e) => {
        console.error(e);
        toast.error(`Unable to add ${name} right now. :(`);

        // TODO: yeet the card back? Lol
      });
    });

    api.start((i) => {
      if (index !== i) return;

      return {
        x: maxWidth + YEET_DISTANCE,
      };
    });
  };

  const dismissTrack = (index: number, trackId: string, name: string) => {
    gone.add(index);
    setTopDeckIndex(index - 1);
    toast.info(`Dismissed ${name}`, {
      duration: 1000,
    });

    startTransition(() => {
      // TODO: Needs to be added to dismissed songs
      // addBangerAction(trackId)
      //   .then(() => {
      //  })
      //  .catch((e) => {
      //    console.error(e);
      //    toast.error(`Unable to add ${name} right now. :(`);
      //  });
    });
    api.start((i) => {
      if (index !== i) return;

      return {
        x: (maxWidth + YEET_DISTANCE) * -1,
      };
    });
  };

  return (
    <div className={styles.swiperRootRoot}>
      {props.map(({ x, y, scale }, index) => (
        <animated.div className="absolute h-full w-full" key={index} style={{ x, y }}>
          <animated.div
            className="h-full w-full touch-none"
            {...bind(index)}
            style={{ transform: interpolate([scale], scaleFn) }}
          >
            <BangOrNoBangTrack
              track={suggestions[index]}
              className="absolute"
              autoplay={topDeckIndex === index && !autoplayDisabled && stackInitiated}
              disabled={!stackInitiated || topDeckIndex !== index}
              onDismiss={() => {
                dismissTrack(index, suggestions[index].id, suggestions[index].name);
              }}
              onBanger={() => {
                bangTrack(index, suggestions[index].id, suggestions[index].name);
              }}
            />
            <animated.div
              className={styles.bangerNotification}
              style={{
                opacity: x.to((val) => {
                  if (val === 0 || completedMountAnimations.current < 25) return 0;
                  if (val < 0) return 0;
                  return Math.min(Math.abs(val) / (maxWidth * 0.1), 1);
                }),
              }}
            >
              <div>Banger!</div>
              <animated.div
                className="transition-opacity opacity-0"
                style={{
                  opacity: x.to((val) => (hasMovedEnough(val, maxWidth) ? 1 : 0)),
                }}
              >
                <CheckIcon className="h-32 w-32 text-green-50" />
              </animated.div>
            </animated.div>
            <animated.div
              className={styles.notBangerNotification}
              style={{
                opacity: x.to((val) => {
                  if (val === 0 || completedMountAnimations.current < 25) return 0;
                  if (val > 0) return 0;
                  return Math.min(Math.abs(val) / (maxWidth * 0.1), 1);
                }),
              }}
            >
              <div>No thanks</div>
              <animated.div
                className="transition-opacity opacity-0"
                style={{
                  opacity: x.to((val) => (hasMovedEnough(val, maxWidth) ? 1 : 0)),
                }}
              >
                <Cross2Icon className="h-32 w-32 text-green-50" />
              </animated.div>
            </animated.div>
          </animated.div>
        </animated.div>
      ))}
      <SwiperLanding
        onClick={() => {
          initStack();
        }}
      />
    </div>
  );
}

export default Swiper;
