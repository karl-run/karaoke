import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import { getUserGroups } from '@/db/groups';
import { getUser } from '@/session/user';
import Link from 'next/link';

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
    <div>
      {groups.map((group) => (
        <div key={group.id}>
          <div>{group.name}</div>
          <Link href={`/groups/${group.id}`} className="underline">
            View group
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Page;
