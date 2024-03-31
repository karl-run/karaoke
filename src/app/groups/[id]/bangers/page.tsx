import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import Link from 'next/link';
import { getGroup } from '@/db/groups';
import { getGroupBangers } from '@/db/bangers';
import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { TrackSkeleton } from '@/components/rsc/Track';
import { getTrack } from '@/spotify/track';

type Props = {
  params: {
    id: string;
  };
};

function Page({ params: { id } }: Props): ReactElement {
  return (
    <SmallPage
      title="Group bangers"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
    >
      <div className="flex gap-4 -mt-6 underline">
        <Link href={`/groups/${id}/details`}>Group details</Link>
      </div>
      <Suspense>
        <GroupBangers id={id} />
      </Suspense>
    </SmallPage>
  );
}

async function GroupBangers({ id }: { id: string }) {
  const [group, bangers] = await Promise.all([getGroup(id), getGroupBangers(id)]);

  return (
    <div>
      <h1 className="text-lg">Certified bangers for {group.name}</h1>
      <TrackGrid>
        {bangers.map((banger) => (
          <div key={banger.songId} className="relative">
            <div className="text-xs mb-1 truncate">{banger.users.join(', ')}</div>
            {banger.track != null ? (
              <Track track={banger.track} action="none" />
            ) : (
              <Suspense fallback={<TrackSkeleton />}>
                <LazyTrack trackId={banger.songId} />
              </Suspense>
            )}
            <div className="absolute right-0 top-5 xs:top-4 xs:left-0 bg-green-800/80 rounded-full w-6 h-6 flex items-center justify-center m-2 border border-gray-800/70">
              {banger.userCount}
            </div>
          </div>
        ))}
      </TrackGrid>
    </div>
  );
}

async function LazyTrack({ trackId }: { trackId: string }): Promise<ReactElement> {
  const track = await getTrack(trackId, true);

  return <Track track={track} action="none" />;
}

export default Page;
