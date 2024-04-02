import React, { ReactElement, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getUser } from 'server/user/user-service';
import { getGroupById } from 'server/group/group-db';

import { SmallPage } from '@/components/layout/Layouts';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Button } from '@/components/ui/button';
import GroupAvatar from '@/components/avatar/GroupAvatar';
import DeleteGroupButton from '@/components/DeleteGroupButton';

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
      <Suspense>
        <Group id={id} />
      </Suspense>
    </SmallPage>
  );
}

async function Group({ id }: { id: string }) {
  const [group, user] = await Promise.all([getGroupById(id), getUser()]);

  if (group == null || group.users.find((u) => u.userId === user?.userId) == null) {
    notFound();
  }

  const userIsAdmin = group.users.find((it) => it.role === 'admin')?.userId === user?.userId;

  return (
    <div>
      <div className="flex gap-3 items-center">
        <GroupAvatar iconIndex={group.iconIndex} />
        <h1 className="text-lg">{group.name}</h1>
      </div>
      <div className="mt-4">{group.users.length} members:</div>
      <ul>
        {group.users.map((user) => (
          <li key={user.displayName}>
            {user.displayName} ({user.role})
          </li>
        ))}
      </ul>
      <div className="p-2 flex items-end gap-3 mt-8">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="join-code">Invite link</Label>
          <Input
            id="join-code"
            name="join-code"
            readOnly
            value={`https://karaoke.karl.run/groups/join?code=${group.joinCode}`}
          />
        </div>
        <CopyToClipboard value={`https://karaoke.karl.run/groups/join?code=${group.joinCode}`} />
      </div>

      {userIsAdmin && (
        <div className="mt-2 border border-dashed p-4 rounded">
          <h2 className="text-lg mb-4">Danger zone</h2>
          <p className="mb-4">
            Permanently delete group. This will not delete any of your bangers, only the group and remove any members
            from it.
          </p>
          <Suspense>
            <DeleteGroupButton groupId={id} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default Page;
