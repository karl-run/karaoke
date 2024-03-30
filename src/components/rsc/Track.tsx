import React, { ReactElement } from "react";
import Image from "next/image";
import PlaySong from "@/components/PlaySong";
import { TrackResult } from "@/spotify/search";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddTrack from "@/components/AddTrack";

type Props = {
  track: TrackResult;
};

function Track({ track }: Props): ReactElement {
  return (
    <div key={track.id} className="flex flex-row xs:flex-col relative">
      <AddTrack id={track.id} shortname={`${track.name} - ${track.artist}`} />
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

export default Track;
