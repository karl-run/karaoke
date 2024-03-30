import Image from "next/image";
import { search } from "@/spotify/search";
import PlaySong from "@/components/PlaySong";
import React, { PropsWithChildren, Suspense } from "react";
import UserBar from "@/components/rsc/UserBar";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  searchParams: {
    q: string;
  };
}

export default async function Home({ searchParams }: Props) {
  return (
    <div className="container mx-auto">
      <UserBar />
      <Suspense key={searchParams.q} fallback={<TrackSearchSkeleton />}>
        <TrackSearch query={searchParams.q} />
      </Suspense>
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
        <div key={track.id} className="flex flex-row xs:flex-col relative">
          <Image
            className="h-12 w-12 xs:w-full xs:h-auto aspect-square rounded-xl"
            src={track.image.url}
            alt={track.name}
            width={200}
            height={200}
          />
          <div className="flex items-center p-1 grow">
            <div className="grow text-sm">
              <div className="max-w-[200px] truncate" title={track.name}>
                {track.name}
              </div>
              <div className="max-w-[200px] truncate" title={track.artist}>
                {track.artist}
              </div>
            </div>
            {track.preview_url && (
              <div className="h-10 w-10 absolute left-1 top-1 xs:relative xs:left-0 xs:top-0">
                <PlaySong songId={track.id} previewUrl={track.preview_url} />
              </div>
            )}
          </div>
        </div>
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
