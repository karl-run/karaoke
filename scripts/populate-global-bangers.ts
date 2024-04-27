/* eslint-disable no-console */

import { getPlaylistWithTracks } from '../src/server/spotify/playlist';
import { db, globalBangers, normalizedSongCache } from '../src/server/db';
import { trackToNormalizedId } from '../src/server/bangers/normalization';

const playlists = [
  {
    // spotify curated list,
    id: '37i9dQZF1DX5I05jXm1F2M',
    region: 'global',
  },
  {
    // big user list
    id: '2ydyIaxEYvkMtefJBIIEqK',
    region: 'global',
  },
  {
    // big norwegian list
    id: '6Rbo2HR3f7P6DZxqhmh1UY',
    region: 'norway',
  },
];

for (const playlist of playlists) {
  // @ts-ignore
  const listWithTracks = await getPlaylistWithTracks(playlist.id);

  if ('errorMessage' in listWithTracks) {
    console.log(`Error fetching playlist ${playlist.id}: ${listWithTracks.errorMessage}`);
    continue;
  }

  console.log(
    `Track with ${listWithTracks.tracks?.length} tracks from ${playlist.region} playlist ${listWithTracks.name}`,
  );

  if (listWithTracks.tracks == null) {
    console.log(`No tracks found for playlist id ${playlist.id}`);
    continue;
  }

  for (const track of listWithTracks.tracks) {
    // @ts-ignore
    await db.transaction(async (tx) => {
      const trackId = trackToNormalizedId(track);

      console.info(`Inserting ${trackId}`);
      await db
        .insert(normalizedSongCache)
        .values({
          songKey: trackId,
          data: track,
        })
        .onConflictDoNothing();
      await tx
        .insert(globalBangers)
        .values({
          songKey: trackId,
          addedAt: new Date(),
          region: playlist.region,
        })
        .onConflictDoNothing();
    });
  }
}
