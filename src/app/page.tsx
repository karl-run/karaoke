import React, { Suspense } from 'react';
import UserBar from '@/components/rsc/UserBar';
import Landing from '@/components/Landing';
import Track, { TrackSkeleton } from '@/components/rsc/Track';
import { searchTracks } from '@/spotify/track';
import { TrackGrid } from '@/components/track/TrackGrid';
import { getUserSongMap, getUserSongs } from '@/db/song-cache';
import { getActiveSession } from '@/db/sessions';
import { getSessionId } from '@/session/user';
import { TrackResult } from '@/spotify/types';

interface Props {
  searchParams: {
    q: string;
  };
}

export default async function Home({ searchParams }: Props) {
  return (
    <div className="container mx-auto">
      <UserBar />
      {searchParams.q == null ? (
        <Landing />
      ) : (
        <Suspense key={searchParams.q} fallback={<TrackSearchSkeleton />}>
          <TrackSearch query={searchParams.q} />
        </Suspense>
      )}
    </div>
  );
}

async function TrackSearch({ query }: { query: string }) {
  if (!query)
    return (
      <div className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Start searching for bangers</div>
      </div>
    );

  const session = await getActiveSession(getSessionId());
  const cachePromise: Promise<Record<string, TrackResult | null>> = session
    ? getUserSongMap(session.user_id)
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
