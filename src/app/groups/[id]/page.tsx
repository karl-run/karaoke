import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import { getGroup } from '@/db/groups';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CopyToClipboard from '@/components/CopyToClipboard';

type Props = {
  params: {
    id: string;
  };
};

function Page({ params: { id } }: Props): ReactElement {
  return (
    <SmallPage
      title="Group Details"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
    >
      <Suspense>
        <Group id={id} />
      </Suspense>
    </SmallPage>
  );
}

async function Group({ id }: { id: string }) {
  const group = await getGroup(id);

  return (
    <div>
      <h1 className="text-lg">{group.name}</h1>
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
    </div>
  );
}

export default Page;
