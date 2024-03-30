import React, { ReactElement } from "react";
import Image from "next/image";
import PlaySong from "@/components/PlaySong";
import { TrackResult } from "@/spotify/types";
import AddTrack from "@/components/AddTrack";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  track: TrackResult;
  action: "addable" | "removeable";
};

function Track({ track, action }: Props): ReactElement {
  return (
    <div key={track.id} className="flex flex-row xs:flex-col relative">
      {action === "addable" && (
        <AddTrack id={track.id} shortname={`${track.name} - ${track.artist}`} />
      )}
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
  );
}

export function TrackSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-square max-w-full" />
      <div className="flex items-center p-1 gap-1">
        <div className="grow flex flex-col gap-1">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}

export default Track;
