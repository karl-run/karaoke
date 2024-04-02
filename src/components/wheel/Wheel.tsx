import React, { CSSProperties, PropsWithChildren, ReactElement } from 'react';

import { cn } from '@/lib/utils';

import styles from './Wheel.module.css';

function Wheel({ children, skip }: PropsWithChildren<{ skip?: boolean }>): ReactElement {
  return (
    <div
      className={cn(
        styles.wheel,
        'relative h-full w-full max-w-full sm:max-w-prose aspect-square rounded-full border-4 border-white',
        {
          '!animate-none': skip,
        },
      )}
    >
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-red-500')}
        style={
          {
            '--rotate': '0deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-yellow-500')}
        style={
          {
            '--rotate': '45deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-blue-500')}
        style={
          {
            '--rotate': '90deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-green-500')}
        style={
          {
            '--rotate': '135deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-purple-500')}
        style={
          {
            '--rotate': '180deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-pink-500')}
        style={
          {
            '--rotate': '225deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-orange-500')}
        style={
          {
            '--rotate': '270deg',
          } as CSSProperties
        }
      ></div>
      <div
        className={cn(styles.slice, 'absolute h-full w-full bg-indigo-500')}
        style={
          {
            '--rotate': '315deg',
          } as CSSProperties
        }
      ></div>
      {children}
    </div>
  );
}

export default Wheel;
