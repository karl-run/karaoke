'use client'

import React, { PropsWithChildren, ReactElement } from 'react'
import Image from 'next/image'

import { TrackResult } from 'server/spotify/types'

import { cn } from '@/lib/utils'

import styles from './ShowAfter5Seconds.module.css'

type Props = {
  track: TrackResult
}

function ShowAfter5Seconds({ track, children }: PropsWithChildren<Props>): ReactElement | null {
  const [show, setShow] = React.useState(false)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, 3500)
    return () => clearTimeout(timeout)
  }, [])

  if (!show) {
    // Preload image
    return <Image unoptimized className="hidden" src={track.image.url} alt={track.name} width={200} height={200} />
  }

  return (
    <div
      className={cn(styles.base, 'flex justify-center items-center', {
        [styles.animateEnter]: show,
      })}
    >
      <Image
        unoptimized
        className="w-auto h-auto my-1 absolute"
        src={track.image.url}
        alt={track.name}
        width={200}
        height={200}
      />
      <div className="bg-black/50 w-full p-4 rounded-xl absolute text-3xl text-white">
        <div className="text-center font-bold">{track.name}</div>
        <div className="text-center font-bold">{track.artist}</div>
        {children && <div className="text-center font-bold">{children}</div>}
      </div>
    </div>
  )
}

export default ShowAfter5Seconds
