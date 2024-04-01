import React, { ReactElement, Suspense } from 'react';
import { getActiveSession } from '@/db/sessions';
import { cookies } from 'next/headers';
import { getUserSongs } from '@/db/song-cache';
import { TrackResult } from '@/spotify/types';
import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { TrackSkeleton } from '@/components/rsc/Track';
import { getTrack } from '@/spotify/track';
import { FullPage } from '@/components/layout/Layouts';
import ImportFromSpotify from '@/components/import-from-spotify/ImportFromSpotify';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Page(): ReactElement {
  return (
    <FullPage
      title="My bangers"
      back="search"
      actions={
        <div className="flex gap-3">
          <Button variant="outline" asChild className="hidden sm:block">
            <Link href="/bangers/m3u8">Import .m3u8 file</Link>
          </Button>
          <ImportFromSpotify />
        </div>
      }
    >
      <Suspense fallback={<BangersSkeleton />}>
        <BangersList />
      </Suspense>
    </FullPage>
  );
}

async function BangersList(): Promise<ReactElement> {
  const session = await getActiveSession(cookies().get('session')?.value ?? null);

  if (!session) {
    return (
      <div className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Log in to see your bangers</div>
      </div>
    );
  }

  const bangs = await getUserSongs(session.user_id);

  if (bangs.length === 0) {
    return (
      <div>
        <div className="text-lg opacity-70">No songs found</div>
        <p className="mt-8">Start adding bangers by searching for songs and adding them to your list.</p>
      </div>
    );
  }

  return (
    <TrackGrid>
      {bangs.map(([song_id, track]) => (
        <div key={song_id}>
          {track != null ? (
            <KnownTrack track={track} />
          ) : (
            <Suspense fallback={<TrackSkeleton />}>
              <LazyTrack trackId={song_id} />
            </Suspense>
          )}
        </div>
      ))}
    </TrackGrid>
  );
}

async function KnownTrack({ track }: { track: TrackResult }): Promise<ReactElement> {
  return <Track track={track} action="removable" />;
}

async function LazyTrack({ trackId }: { trackId: string }): Promise<ReactElement> {
  const track = await getTrack(trackId, true);

  return <Track track={track} action="removable" />;
}

function BangersSkeleton() {
  return (
    <TrackGrid>
      {[...Array(20)].map((_, index) => (
        <TrackSkeleton key={index} />
      ))}
    </TrackGrid>
  );
}

export default Page;
