import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import { getGroup } from '@/db/groups';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CopyToClipboard from '@/components/CopyToClipboard';
import Link from 'next/link';
import { GearIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import GroupAvatar from '@/components/avatar/GroupAvatar';
import DeleteGroupButton from '@/components/DeleteGroupButton';
import { getUser } from '@/session/user';

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
  const [group, user] = await Promise.all([getGroup(id), getUser()]);

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
        <div className="mt-8">
          <h2>Danger zone</h2>
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