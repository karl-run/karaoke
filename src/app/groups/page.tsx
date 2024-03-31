import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import { getUserGroups } from '@/db/groups';
import { getUser } from '@/session/user';
import Link from 'next/link';
import GroupAvatar from '@/components/avatar/GroupAvatar';

function Page(): ReactElement {
  return (
    <SmallPage
      title="My groups"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <UserGroups />
      </Suspense>

      <div className="flex flex-col sm:flex-row gap-1 mt-8">
        <h2>Got more friends?</h2>
        <Link className="underline" href="/groups/join">
          Join a group
        </Link>
        <p>or</p>
        <Link className="underline" href="/groups/create">
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

function GroupListItem(props: { group: any }) {
  return (
    <Link href={`/groups/${props.group.id}/bangers`} className="rounded hover:outline">
      <div className="flex gap-3">
        <GroupAvatar iconIndex={props.group.iconIndex} />
        <div>
          <div>{props.group.name}</div>
          <div className="text-sm">{props.group.memberCount} members</div>
        </div>
      </div>
    </Link>
  );
}

export default Page;
