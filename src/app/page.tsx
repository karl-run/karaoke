import { search } from "@/spotify/search";
import React, { PropsWithChildren, Suspense } from "react";
import UserBar from "@/components/rsc/UserBar";
import { Skeleton } from "@/components/ui/skeleton";
import Landing from "@/components/Landing";
import Track from "@/components/rsc/Track";

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

  const result = await search(query, "track");

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
    <TrackSearchGrid>
      {result.map((track) => (
        <Track key={track.id} track={track} />
      ))}
    </TrackSearchGrid>
  );
}

function TrackSearchSkeleton() {
  return (
    <TrackSearchGrid>
      {[...Array(20)].map((_, index) => (
        <div key={index} className="flex flex-col">
          <Skeleton className="aspect-square max-w-full" />
          <div className="flex items-center p-1 gap-1">
            <div className="grow flex flex-col gap-1">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      ))}
    </TrackSearchGrid>
  );
}

function TrackSearchGrid({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2">
      {children}
    </div>
  );
}
