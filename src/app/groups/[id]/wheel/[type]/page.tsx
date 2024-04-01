import React, { CSSProperties, ReactElement, Suspense } from 'react';
import { FullPage } from '@/components/layout/Layouts';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { getUser } from '@/session/user';
import { getGroup } from '@/db/groups';
import { getSpecialSongInGroup } from '@/wheel/wheel-service';

import styles from './_page.module.css';
import { cn } from '@/lib/utils';
import ShowAfter5Seconds from '@/components/wheel/ShowAfter5Seconds';

type Props = {
  params: {
    id: string;
    type: string;
  };
};

function Page({ params }: Props): ReactElement {
  if (!['1', '2', '3'].includes(params.type)) {
    notFound();
  }

  return (
    <FullPage
      title="Which song will it be?"
      back={{
        to: `/groups/${params.id}/bangers`,
        text: 'Back to group bangers',
      }}
    >
      <Suspense fallback={<WheelSkeleton />}>
        <WheelWithData groupId={params.id} type={params.type as '1' | '2' | '3'} />
      </Suspense>
    </FullPage>
  );
}

async function WheelWithData({ groupId, type }: { groupId: string; type: '1' | '2' | '3' }): Promise<ReactElement> {
  const [group, user] = await Promise.all([getGroup(groupId), getUser()]);

  if (group == null || group.users.find((u) => u.userId === user?.userId) == null) {
    notFound();
  }

  const selectedSong = await getSpecialSongInGroup(groupId, type);

  return (
    <div>
      <div
        className={cn(
          styles.wheel,
          'relative h-full w-full max-w-full sm:max-w-prose aspect-square rounded-full border-4 border-white',
        )}
      >
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-red-500')}
          style={
            {
              '--rotate': '0deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-yellow-500')}
          style={
            {
              '--rotate': '45deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-blue-500')}
          style={
            {
              '--rotate': '90deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-green-500')}
          style={
            {
              '--rotate': '135deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-purple-500')}
          style={
            {
              '--rotate': '180deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-pink-500')}
          style={
            {
              '--rotate': '225deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-orange-500')}
          style={
            {
              '--rotate': '270deg',
            } as CSSProperties
          }
        ></div>
        <div
          className={cn(styles.slice, 'absolute h-full w-full bg-indigo-500')}
          style={
            {
              '--rotate': '315deg',
            } as CSSProperties
          }
        ></div>
        <ShowAfter5Seconds track={selectedSong!} />
      </div>
    </div>
  );
}

function WheelSkeleton() {
  return (
    <div>
      <Skeleton className="w-full aspect-square rounded-full" />
    </div>
  );
}

export default Page;
