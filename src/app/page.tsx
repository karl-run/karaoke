import React, { Suspense } from 'react';
import Link from 'next/link';

import { searchTracks } from 'server/spotify/track';
import { TrackResult } from 'server/spotify/types';
import { getUser } from 'server/user/user-service';
import { getUserBangersRecord } from 'server/bangers/bangers-service';

import Landing from '@/components/landing/Landing';
import Track, { TrackSkeleton } from '@/components/track/Track';
import { TrackGrid } from '@/components/track/TrackGrid';
import { FullPage } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: {
    q: string;
  };
}

export default async function Home({ searchParams }: Props) {
  return (
    <FullPage title={searchParams.q != null ? 'Find new songs' : undefined}>
      {searchParams.q == null ? (
        <Landing />
      ) : (
        <Suspense key={searchParams.q} fallback={<TrackSearchSkeleton />}>
          <TrackSearch query={searchParams.q} />
        </Suspense>
      )}
    </FullPage>
  );
}

async function TrackSearch({ query }: { query: string }) {
  if (!query || query.length < 4)
    return (
      <div className="relative overflow-hidden h-64">
        <TrackGrid>
          <TrackSkeleton />
          <TrackSkeleton />
          <TrackSkeleton />
          <TrackSkeleton />
        </TrackGrid>
        <div className="absolute top-0 h-72 p-8 w-full bg-gradient-to-b from-transparent to-background flex items-center justify-center flex-col gap-16">
          <div className="text-xl opacity-70 text-center">Start typing to search for new bangers...</div>
          <Button size="lg" className="animate-bounce" asChild>
            <Link href="/explore">Or explore...</Link>
          </Button>
        </div>
      </div>
    );

  const user = await getUser();
  const cachePromise: Promise<Record<string, TrackResult | null>> = user
    ? getUserBangersRecord(user.userId)
    : Promise.resolve({});

  const searchPromise = searchTracks(query);
  const [result, cache] = await Promise.all([searchPromise, cachePromise]);

  if (result.length === 0) {
    return (
      <div className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">No songs found matching &quot;{query}&quot;</div>
      </div>
    );
  }

  return (
    <TrackGrid>
      {result.map((track) => (
        <Track key={track.id} track={track} action={cache[track.id] != null ? 'already-added' : 'addable'} />
      ))}
    </TrackGrid>
  );
}

function TrackSearchSkeleton() {
  return (
    <TrackGrid>
      {[...Array(20)].map((_, index) => (
        <TrackSkeleton key={index} />
      ))}
    </TrackGrid>
  );
}
