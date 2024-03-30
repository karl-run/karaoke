import React, { ReactElement, Suspense } from 'react';
import UserBar from '@/components/rsc/UserBar';
import { getActiveSession } from '@/db/sessions';
import { cookies } from 'next/headers';
import { getUserSongs } from '@/db/song-cache';
import { TrackResult } from '@/spotify/types';
import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { TrackSkeleton } from '@/components/rsc/Track';
import { getTrack } from '@/spotify/track';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function Page(): ReactElement {
  return (
    <div className="container">
      <UserBar />
      <div className="p-8 flex flex-col">
        <h1 className="text-xl mb-2">My bangers</h1>
        <div>
          <Link href="/?focus=true&q=" className="flex items-center gap-1 mb-4 max-w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
        </div>
        <Suspense fallback={<BangersSkeleton />}>
          <BangersList />
        </Suspense>
      </div>
    </div>
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
    <div className="p-20 flex justify-center items-center">
      <div className="text-xl opacity-70">Loading bangers...</div>
    </div>
  );
}

export default Page;
