'use client'

import React, { ReactElement, useEffect } from 'react'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

interface Props {
  songId: string
  previewUrl: string
  autoplay?: boolean
}

function PlaySong({ songId, previewUrl, autoplay }: Props): ReactElement {
  const [play, setPlay] = React.useState<boolean>(autoplay ?? false)
  const broadcastRef = React.useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    setPlay(autoplay ?? false)
  }, [autoplay])

  useEffect(() => {
    broadcastRef.current = new BroadcastChannel('playing_songs')

    const handleStopAll = () => {
      setPlay(false)
    }

    broadcastRef.current.addEventListener('message', handleStopAll)
    return () => {
      broadcastRef.current?.removeEventListener('message', handleStopAll)
    }
  }, [songId])

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full h-full w-full"
        onClick={() => {
          const newPlay = !play
          if (newPlay) {
            broadcastRef.current?.postMessage('stop-all')
          }

          setPlay(newPlay)
        }}
      >
        {play ? <StopIcon /> : <PlayIcon />}
      </Button>
      {play && <audio id={`song-preview-${songId}`} src={previewUrl} autoPlay />}
    </>
  )
}

export default PlaySong
