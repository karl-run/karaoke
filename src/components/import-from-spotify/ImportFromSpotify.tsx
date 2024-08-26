'use client'

import React, { ReactElement, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useQueryState } from 'nuqs'

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { importFromSpotifyAction } from '@/components/import-from-spotify/ImportFromSpotifyActions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { getIdFromUrl } from './spotify-url-utils'

type Props = {
  validPlaylistSongCount: number | null
}

function ImportFromSpotify({ validPlaylistSongCount }: Props): ReactElement {
  const [transition, startTransition] = useTransition()
  const [initialPid, setPid] = useQueryState('pid', {
    throttleMs: 1500,
    startTransition: startTransition,
  })
  const [url, setUrl] = useState(initialPid ?? '')
  const extractedUrl = getIdFromUrl(url)
  const [state, formAction] = useFormState(importFromSpotifyAction, {})
  const disabled = transition || validPlaylistSongCount == null

  return (
    <div>
      <p className="mb-4">Paste the spotify playlist URL to import songs from it.</p>
      <div className="py-4 max-w-prose">
        <form className="flex flex-col gap-3" action={formAction}>
          <Label htmlFor="spotify-url">Spotify playlist URL</Label>
          <Input
            id="spotify-url"
            name="url"
            disabled={transition}
            value={url}
            onChange={(event) => {
              setUrl(event.currentTarget.value)

              const extractedPid = getIdFromUrl(event.currentTarget.value)

              setPid(extractedPid)
            }}
            required
            placeholder="https://open.spotify.com/playlist/your-play-list"
          />
          {validPlaylistSongCount != null ? (
            <div className="mt-2 h-2 flex gap-2 items-center">
              <CheckIcon className="h-4 w-4" />
              Playlist with {validPlaylistSongCount} songs
            </div>
          ) : (
            <div className="mt-2 h-2 flex gap-2 items-center" />
          )}

          <p className="mt-4">Do you want to</p>
          <div className="flex flex-col gap-3 sm:flex-row justify-between items-center">
            <Button className="grow w-full" disabled={disabled}>
              Import songs {validPlaylistSongCount ? `all ${validPlaylistSongCount}` : 'all'} songs
            </Button>
            <p className="mt-0 min-w-16 text-center">or</p>
            <Button type="button" className="grow w-full" disabled={disabled}>
              <Link
                href={`/playlist/${extractedUrl}`}
                className={cn(buttonVariants({ variant: 'default' }), disabled && 'pointer-events-none opacity-50')}
              >
                Select individual songs
              </Link>
            </Button>
          </div>
        </form>
        {state.error && (
          <Alert className="mt-8">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Unable to import playlist</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state.tracksAdded != null && (
          <Alert className="mt-8">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Added {state.tracksAdded} tracks to playlist</AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default ImportFromSpotify
