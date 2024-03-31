import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import { getGroup } from '@/db/groups';

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
      <div>{group.users.length} members:</div>
      <ul>
        {group.users.map((user) => (
          <li key={user.displayName}>
            {user.displayName} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
