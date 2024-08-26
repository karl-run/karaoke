import React, { ReactElement, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as R from 'remeda';
import { Metadata } from 'next';

import { getUser } from 'server/user/user-service';
import { getGroupById } from 'server/group/group-db';

import { SmallPage } from '@/components/layout/Layouts';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Button } from '@/components/ui/button';
import GroupAvatar from '@/components/avatar/GroupAvatar';
import DeleteGroupButton from '@/components/DeleteGroupButton';
import LeaveGroupButton from '@/components/LeaveGroupButton';
import InvalidateInviteLink from '@/components/InvalidateInviteLink';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Karaoke Match - Group Details',
};

type Props = {
  params: {
    id: string;
  };
};

function Page({ params: { id } }: Props): ReactElement {
  return (
    <SmallPage
      title="Details"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
      actions={
        <Button variant="outline" asChild>
          <Link href={`/groups/${id}/bangers`}>Group bangers</Link>
        </Button>
      }
    >
      <Suspense fallback={<GroupSkeleton />}>
        <Group groupId={id} />
      </Suspense>
    </SmallPage>
  );
}

async function Group({ groupId }: { groupId: string }) {
  const [group, user] = await Promise.all([getGroupById(groupId), getUser()]);

  if (group == null || group.users.find((u) => u.userId === user?.userId) == null) {
    notFound();
  }

  const userIsAdmin = group.users.find((it) => it.role === 'admin')?.userId === user?.userId;
  const sortedUsers = R.sortBy(group.users, [(it) => it.role === 'admin', 'desc'], [(it) => it.count, 'desc']);

  return (
    <div>
      <div className="flex gap-3 items-center mb-4">
        <GroupAvatar iconIndex={group.iconIndex} />
        <div>
          <h1 className="text-lg">{group.name}</h1>
          <div className="text-xs">{group.users.length} members</div>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {sortedUsers.map((user) => (
          <li key={user.displayName} className="border p-2 rounded relative hover:bg-accent">
            <Link href={`/user/${user.safeId}`} className="hover:underline">
              <div>{user.displayName}</div>
              <div className="text-xs">{user.count} bangers</div>
              <div className="absolute top-2 right-2 text-sm">{user.role}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-end gap-3 mt-8">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="join-code">Invite link</Label>
          <Input
            id="join-code"
            name="join-code"
            readOnly
            value={`https://karaoke.karl.run/groups/join?code=${group.joinCode}`}
          />
        </div>
        <CopyToClipboard value={`https://karaoke.karl.run/groups/join?code=${group.joinCode}`} />
        {userIsAdmin && <InvalidateInviteLink groupId={groupId} />}
      </div>

      <div className="mt-2 border border-dashed p-4 rounded">
        <h2 className="text-lg mb-4">Danger zone</h2>
        {userIsAdmin ? (
          <>
            <p className="mb-4">
              Permanently delete group. This will not delete any of your bangers, only the group and remove any members
              from it.
            </p>
            <Suspense>
              <DeleteGroupButton groupId={groupId} />
            </Suspense>
          </>
        ) : (
          <>
            <p className="mb-4">
              Feel free to leave the group if you no longer want to be a part of it. This will not delete any of your
              personal bangers.
            </p>
            <Suspense>
              <LeaveGroupButton groupId={groupId} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}

function GroupSkeleton() {
  return (
    <div>
      <div className="flex gap-3 items-center mb-4">
        <div className="flex gap-3 items-center">
          <Skeleton className="w-12 h-12" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-40 h-6" />
            <Skeleton className="w-12 h-4" />
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-2 relative">
        {R.range(0, 4).map((user) => (
          <li key={user} className="border p-2 rounded relative hover:bg-accent">
            <div className="hover:underline flex flex-col gap-2">
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-16 h-3" />
              <div className="absolute top-2 right-2 text-sm">
                <Skeleton className="w-10 h-4" />
              </div>
            </div>
          </li>
        ))}
        <div className="bg-gradient-to-b from-transparent to-background absolute w-full h-full" />
      </ul>
    </div>
  );
}

export default Page;
