'use client';

import React, { ReactElement, useState } from 'react';
import { TrackResult } from '@/spotify/types';
import { ArtistSongTuple } from '@/spotify/m3u-parser';
import FileDropZone from '@/components/FileDropZone';
import { TrackGrid } from '@/components/track/TrackGrid';
import ArbitraryAddableTrack from '@/components/import-from-m3u8/ArbitraryAddableTrack';

type Props = {
  existingSongs: Record<string, TrackResult | null>;
};

function ImportFromM3U8({ existingSongs }: Props): ReactElement {
  const [songs, setSongs] = useState<ArtistSongTuple[] | null>(null);
  return (
    <div>
      <div className="max-w-prose">
        <FileDropZone onFileLoad={setSongs}></FileDropZone>
      </div>
      <div className="flex flex-col gap-3">
        {songs?.map(([artist, song]) => (
          <ArbitraryAddableTrack
            key={`${artist}-${song}`}
            existingSongs={existingSongs}
            artist={artist}
            name={song}
          ></ArbitraryAddableTrack>
        ))}
      </div>
    </div>
  );
}

export default ImportFromM3U8;
