import React, { ReactElement, Suspense } from 'react';
import Link from 'next/link';

import { getUser } from 'server/user/user-service';

import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { LazyTrack, TrackSkeleton } from '@/components/track/Track';
import { FullPage, FullPageDescription } from '@/components/layout/Layouts';
import ImportFromSpotify from '@/components/import-from-spotify/ImportFromSpotify';
import { Button } from '@/components/ui/button';
import { getUserBangersCached } from '@/server/bangers/bangers-service';

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
