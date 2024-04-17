import React, { ReactElement, Suspense } from 'react';

import { getPlaylistWithTracks } from 'server/spotify/playlist';

import { FullPage, FullPageDescription } from '@/components/layout/Layouts';
import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { TrackSkeleton } from '@/components/track/Track';

type Props = {
  params: {
    pid: string;
  };
};

function Page({ params }: Props): ReactElement {
  return (
    <FullPage title="Spotify playlist" back={{ text: 'Back to home', to: '/' }}>
      <Suspense fallback={<PlaylistSkeleton />}>
        <Playlist playlistId={params.pid} />
      </Suspense>
    </FullPage>
  );
}

async function Playlist({ playlistId }: { playlistId: string }): Promise<ReactElement> {
  const playlist = await getPlaylistWithTracks(playlistId);

  if ('errorMessage' in playlist) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">Error fetching playlist</div>
        <p className="mt-8">{playlist.errorMessage}</p>
      </FullPageDescription>
    );
  }

  if (playlist.tracks.length === 0) {
    return (
      <FullPageDescription>
        <div className="text-lg opacity-70">No songs in playlist found</div>
        <p className="mt-8">Make sure the linked playlist contains songs!</p>
      </FullPageDescription>
    );
  }

  return (
    <>
      <FullPageDescription>
        {playlist.name} by {playlist.owner}
      </FullPageDescription>
      <TrackGrid>
        {playlist.tracks.map((track) => (
          <div key={track.id}>
            <Track track={track} action="addable" />
          </div>
        ))}
      </TrackGrid>
    </>
  );
}

function PlaylistSkeleton() {
  return (
    <TrackGrid>
      {[...Array(20)].map((_, index) => (
        <TrackSkeleton key={index} />
      ))}
    </TrackGrid>
  );
}

export default Page;
