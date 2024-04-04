import React, { ReactElement, Suspense } from 'react';
import Link from 'next/link';
import {Crosshair2Icon, GearIcon} from '@radix-ui/react-icons';

import { getUser } from 'server/user/user-service';
import { getUserGroups } from 'server/group/group-db';

import { SmallPage } from '@/components/layout/Layouts';
import GroupAvatar from '@/components/avatar/GroupAvatar';
import { Skeleton } from '@/components/ui/skeleton';

function Page(): ReactElement {
  return (
    <SmallPage
      title="My groups"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      <Suspense
        fallback={
          <div className="flex flex-col gap-3">
            <GroupListItemSkeleton />
            <GroupListItemSkeleton />
          </div>
        }
      >
        <UserGroups />
      </Suspense>

      <div className="flex flex-col sm:flex-row gap-1 mt-8">
        <h2>Got more friends?</h2>
        <Link className="underline" href="/groups/join" prefetch={false}>
          Join a group
        </Link>
        <p>or</p>
        <Link className="underline" href="/groups/create" prefetch={false}>
          create a group.
        </Link>
      </div>
    </SmallPage>
  );
}

async function UserGroups() {
  const user = await getUser();
  if (!user) {
    return <div>You must be logged in to view your groups</div>;
  }

  const groups = await getUserGroups(user.userId);

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </div>
  );
}

function GroupListItem({
  group,
}: {
  group: {
    id: string;
    name: string;
    iconIndex: number;
    memberCount: number;
  };
}) {
  return (
    <div className="rounded flex justify-between">
      <Link href={`/groups/${group.id}/bangers`} className="hover:outline grow" prefetch={false}>
        <div className="flex gap-3">
          <GroupAvatar iconIndex={group.iconIndex} />
          <div className="max-w-44 xs:max-w-full">
            <div className="truncate">{group.name}</div>
            <div className="text-sm">{group.memberCount} members</div>
          </div>
        </div>
      </Link>
      <Link href={`/groups/${group.id}/wheel`} className="w-12 hover:outline flex items-center justify-center" prefetch={false}>
        <Crosshair2Icon className="h-6 w-6" />
      </Link>
      <Link href={`/groups/${group.id}/details`} className="w-12 hover:outline flex items-center justify-center" prefetch={false}>
        <GearIcon className="h-6 w-6" />
      </Link>
    </div>
  );
}

function GroupListItemSkeleton() {
  return (
    <div>
      <div className="flex gap-3">
        <GroupAvatar iconIndex={1} className="grayscale" />
        <div className="flex flex-col gap-2 mt-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

export default Page;
