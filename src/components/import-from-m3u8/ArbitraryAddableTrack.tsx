import React, { ReactElement, useState } from 'react';

import styles from './ArbitraryAddableTrack.module.css';
import { TrackResult } from '@/spotify/types';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { addSongAction, tryToFindSongAction } from '@/components/import-from-m3u8/ArbitraryAddableTrackActions';
import { CardStackPlusIcon, CheckIcon } from '@radix-ui/react-icons';

type Props = {
  artist: string;
  name: string;
  existingSongs: Record<string, TrackResult | null>;
};

function ArbitraryAddableTrack({ artist, name, existingSongs }: Props): ReactElement {
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState<TrackResult | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const alreadyAdded = lookup?.id ? existingSongs[lookup.id] != null : false;

  return (
    <div className={styles.root}>
      <div className={styles.songName}>{name}</div>
      <div className={styles.artist}>{artist}</div>
      {alreadyAdded && <div className={styles.added}>Already added</div>}
      {lookup && (
        <Image
          unoptimized
          src={lookup.image.url}
          width={lookup.image.width}
          height={lookup.image.height}
          alt=""
          className={cn(styles.searchButton)}
        />
      )}
      {!lookup && !notFound && (
        <Button
          variant="outline"
          className={cn(styles.searchButton, 'p-2')}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const result = await tryToFindSongAction(`track:${name} artist:${artist}`);
            setLoading(false);
            setLookup(result);

            if (result == null) {
              setNotFound(true);
            }
          }}
        >
          <SearchIcon className="w-12 h-12" />
        </Button>
      )}
      {!lookup && !notFound && <div className={styles.lookupText}>Find song</div>}
      {!lookup && notFound && <div className={styles.lookupText}>Song not found on Spotify</div>}
      {lookup && <div className={styles.spotifyTop}>{lookup.name}</div>}
      {lookup && <div className={styles.spotifyBottom}>{lookup.artist}</div>}
      {lookup && !added && !alreadyAdded && (
        <Button
          variant="outline"
          className={cn(styles.addButton, 'p-2')}
          disabled={loading || adding || added}
          onClick={async () => {
            setAdding(true);
            const result = await addSongAction(lookup?.id ?? 'unknown');
            setAdding(false);
            setAdded(true);
          }}
        >
          <CardStackPlusIcon className="w-6 h-6" />
        </Button>
      )}
      {lookup && added && <CheckIcon className={cn(styles.addButton, 'w-6 h-6')} />}
    </div>
  );
}

export default ArbitraryAddableTrack;
