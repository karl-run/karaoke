import React, { Suspense } from 'react';

import { searchTracks } from 'server/spotify/track';
import { TrackResult } from 'server/spotify/types';
import { getUser } from 'server/user/user-service';
import {getUserSongMap} from "server/bangers/bangers-service";

import Landing from '@/components/Landing';
import Track, { TrackSkeleton } from '@/components/track/Track';
import { TrackGrid } from '@/components/track/TrackGrid';
import { FullPage } from '@/components/layout/Layouts';


interface Props {
  searchParams: {
    q: string;
  };
}

export default async function Home({ searchParams }: Props) {
  return (
    <FullPage title={searchParams.q != null ? 'Add songs' : undefined}>
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
      <div className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Start searching for bangers</div>
      </div>
    );

  const user = await getUser();
  const cachePromise: Promise<Record<string, TrackResult | null>> = user
    ? getUserSongMap(user.userId)
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
