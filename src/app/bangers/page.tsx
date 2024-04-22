import React, { ReactElement, Suspense } from 'react';

import { getUser } from 'server/user/user-service';

import { TrackGrid, TrackGridSkeleton } from '@/components/track/TrackGrid';
import Track, { LazyTrack, TrackSkeleton } from '@/components/track/Track';
import { FullPage, FullPageDescription } from '@/components/layout/Layouts';
import { getUserBangersCached } from '@/server/bangers/bangers-service';
import { Skeleton } from '@/components/ui/skeleton';
import BangersExtraActions from '@/components/bangers/BangersExtraActions';

function Page(): ReactElement {
  return (
    <FullPage title="My bangers" back="search" actions={<BangersExtraActions />}>
      <Suspense
        fallback={
          <>
            <FullPageDescription className="flex items-center gap-1">
              You have <Skeleton className="h-4 w-6" /> bangers in your list!
            </FullPageDescription>
            <TrackGridSkeleton />
          </>
        }
      >
        <BangersList />
      </Suspense>
    </FullPage>
  );
}

async function BangersList(): Promise<ReactElement> {
  const user = await getUser();
  if (!user) {
    return (
      <FullPageDescription className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Log in to see your bangers</div>
      </FullPageDescription>
    );
  }

  const bangs = await getUserBangersCached(user.userId);
  if (bangs.length === 0) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">No songs found</div>
        <p className="mt-8">Start adding bangers by searching for songs and adding them to your list.</p>
      </FullPageDescription>
    );
  }

  return (
    <>
      <FullPageDescription>You have {bangs.length} bangers in your list!</FullPageDescription>
      <TrackGrid>
        {bangs.map(([song_id, track]) => (
          <div key={song_id}>
            {track != null ? (
              <Track track={track} action="removable" />
            ) : (
              <Suspense fallback={<TrackSkeleton />}>
                <LazyTrack trackId={song_id} action="removable" />
              </Suspense>
            )}
          </div>
        ))}
      </TrackGrid>
    </>
  );
}

export default Page;
