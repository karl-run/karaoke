import React, { ReactElement, Suspense } from 'react';
import { FullPage, FullPageDescription, SmallPage } from '@/components/layout/Layouts';
import Link from 'next/link';
import { getGroup } from '@/db/groups';
import { getGroupBangers } from '@/db/bangers';
import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { TrackSkeleton } from '@/components/rsc/Track';
import { getTrack } from '@/spotify/track';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GearIcon } from '@radix-ui/react-icons';
import { MessageCircleWarningIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GroupAvatar from '@/components/avatar/GroupAvatar';
import { getUser } from '@/session/user';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

function Page({ params: { id } }: Props): ReactElement {
  return (
    <FullPage
      title="Group bangers"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
      actions={
        <Button variant="outline" asChild>
          <Link href={`/groups/${id}/details`}>
            <GearIcon className="h-4 w-4 mr-2" />
            Group details
          </Link>
        </Button>
      }
    >
      <Suspense>
        <GroupBangers id={id} />
      </Suspense>
    </FullPage>
  );
}

async function GroupBangers({ id }: { id: string }) {
  const [group, bangers, user] = await Promise.all([getGroup(id), getGroupBangers(id), getUser()]);

  if (group == null || group.users.find((u) => u.userId === user?.userId) == null) {
    notFound();
  }

  return (
    <div>
      <FullPageDescription>
        <div className="flex gap-3 items-center">
          <GroupAvatar iconIndex={group.iconIndex} />
          <h1 className="text-lg">Certified bangers for {group.name}</h1>
        </div>
      </FullPageDescription>

      {bangers.length === 0 && (
        <Alert className="mt-4">
          <MessageCircleWarningIcon className="h-4 w-4" />
          <AlertTitle>No bangers found?!</AlertTitle>
          <AlertDescription>
            Invite your friends, have them add their karaoke bangers! There has got to be at least one song you all
            share. :-)
          </AlertDescription>
        </Alert>
      )}

      {bangers.length > 0 && (
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
      )}
    </div>
  );
}

async function LazyTrack({ trackId }: { trackId: string }): Promise<ReactElement> {
  const track = await getTrack(trackId, true);

  return <Track track={track} action="none" />;
}

export default Page;
