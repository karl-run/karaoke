'use client';

import React, { ReactElement } from 'react';
import { useFormState } from 'react-dom';
import { EnterIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { importFromSpotifyAction } from '@/components/import-from-spotify/ImportFromSpotifyActions';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { getIdFromUrl } from './spotify-url-utils';

function ImportFromSpotify(): ReactElement {
  const [url, setUrl] = React.useState('');
  const extractedUrl = getIdFromUrl(url);
  const [state, formAction] = useFormState(importFromSpotifyAction, {});

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <EnterIcon />
          Import from spotify
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Import playlist from spotify</SheetTitle>
          <SheetDescription>Paste the spotify playlist URL to import songs from it.</SheetDescription>
        </SheetHeader>
        <div className="py-4 max-w-prose">
          <form className="flex flex-col gap-3" action={formAction}>
            <Input
              name="url"
              onChange={(event) => setUrl(event.currentTarget.value)}
              required
              placeholder="https://open.spotify.com/playlist/your-play-list"
            ></Input>
            <Button>Import songs</Button>
          </form>
          <div
            className={cn('text-sm mt-4', {
              'opacity-0': !extractedUrl,
            })}
          >
            Songs will be imported from playlist with ID:{' '}
          </div>
          {extractedUrl && <code>{extractedUrl}</code>}
          {state.error && (
            <Alert className="mt-2">
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Unable to import playlist</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.tracksAdded != null && (
            <Alert className="mt-2">
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Added {state.tracksAdded} tracks to playlist</AlertTitle>
            </Alert>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ImportFromSpotify;
