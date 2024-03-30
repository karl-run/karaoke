import React, { Suspense } from "react";
import UserBar from "@/components/rsc/UserBar";
import Landing from "@/components/Landing";
import Track, { TrackSkeleton } from "@/components/rsc/Track";
import { searchTracks } from "@/spotify/track";
import { TrackGrid } from "@/components/track/TrackGrid";

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

  const result = await searchTracks(query);

  if (result.length === 0) {
    return (
      <div className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">
          No songs found matching &quot;{query}&quot;
        </div>
      </div>
    );
  }

  return (
    <TrackGrid>
      {result.map((track) => (
        <Track key={track.id} track={track} action="addable" />
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
