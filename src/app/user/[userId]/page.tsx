import React, { ReactElement, Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';

import { getOtherUser, getUser, usersShareGroup } from 'server/user/user-service';
import { getUserBangers, getUserBangersRecord } from 'server/bangers/bangers-service';

import { FullPage, FullPageDescription } from '@/components/layout/Layouts';
import { TrackGrid } from '@/components/track/TrackGrid';
import Track, { LazyTrack, TrackSkeleton } from '@/components/track/Track';

type Props = {
  params: {
    userId: string;
  };
  searchParams: {
    returnTo: string;
  };
};

function Page({ params, searchParams }: Props): ReactElement {
  return (
    <FullPage
      title={`Bangers for this absolute ${getRandomGoodWord()}`}
      back={
        searchParams.returnTo
          ? {
              to: `/groups/${searchParams.returnTo}`,
              text: 'Back to group',
            }
          : {
              to: '/groups',
              text: 'Back to groups',
            }
      }
    >
      <Suspense fallback={<GroupMemberBangersSkeleton />}>
        <GroupMemberBangers userSafeId={params.userId} />
      </Suspense>
    </FullPage>
  );
}

async function GroupMemberBangers({ userSafeId }: { userSafeId: string }) {
  const [user, otherUser] = await Promise.all([getUser(), getOtherUser(userSafeId)]);
  if (!user || !otherUser) {
    notFound();
  }

  if (user.userId === otherUser.userId) {
    // User looking ot their own bangers
    redirect('/bangers');
  }

  if (!(await usersShareGroup(user.userId, otherUser.userId))) {
    console.error('User does not share group with group member, sneaky!');
    notFound();
  }

  const [otherUserBangers, userCache] = await Promise.all([
    getUserBangers(otherUser.userId),
    getUserBangersRecord(user.userId),
  ]);

  return (
    <>
      <FullPageDescription>
        <span className="font-bold">{otherUser.name}</span> has {otherUserBangers.length} bangers!
      </FullPageDescription>
      <TrackGrid>
        {otherUserBangers.map(([trackId, track]) =>
          track != null ? (
            <Track key={trackId} track={track} action={userCache[trackId] != null ? 'already-added' : 'addable'} />
          ) : (
            <Suspense key={trackId} fallback={<TrackSkeleton />}>
              <LazyTrack trackId={trackId} action="addable" />
            </Suspense>
          ),
        )}
      </TrackGrid>
    </>
  );
}

function GroupMemberBangersSkeleton() {
  return <FullPageDescription>Loading...</FullPageDescription>;
}

function getRandomGoodWord() {
  const goodWords = ['legend', 'champion', 'hero', 'master', 'genius'];
  return goodWords[Math.floor(Math.random() * goodWords.length)];
}

export default Page;
