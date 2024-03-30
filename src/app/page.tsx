import Image from "next/image";
import { search } from "@/spotify/search";
import PlaySong from "@/components/PlaySong";
import SearchBar from "@/components/SearchBar";
import React, { Suspense } from "react";
import UserBar from "@/components/rsc/UserBar";

interface Props {
  searchParams: {
    q: string;
  };
}

export default async function Home({ searchParams }: Props) {
  return (
    <main className="">
      <UserBar>
        <SearchBar />
      </UserBar>
      <Suspense key={searchParams.q} fallback={<TrackSearchSkeleton />}>
        <TrackSearch query={searchParams.q} />
      </Suspense>
    </main>
  );
}

async function TrackSearch({ query }: { query: string }) {
  const result = await search(query, "track");

  return (
    <div className="grid grid-cols-6 gap-2 p-2">
      {result.map((track) => (
        <div key={track.id} className="flex flex-col">
          <Image
            className="col-span-2"
            src={track.image.url}
            alt={track.name}
            width={200}
            height={200}
          />
          <div className="flex items-center p-1">
            <div className="grow overflow-hidden text-sm">
              <div>{track.name}</div>
              <div>{track.artist}</div>
            </div>
            {track.preview_url && (
              <div className="h-10 w-10">
                <PlaySong songId={track.id} previewUrl={track.preview_url} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackSearchSkeleton() {
  return (
    <div className="grid grid-cols-8">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="col-span-2">
          <div className="bg-gray-200 w-40 h-40"></div>
          <div className="bg-gray-200 w-40 h-4"></div>
          <div className="bg-gray-200 w-40 h-4"></div>
        </div>
      ))}
    </div>
  );
}
