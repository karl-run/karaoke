import React, { ReactElement, Suspense } from 'react';
import { SmallPage } from '@/components/layout/Layouts';
import { getUser } from '@/session/user';
import DeleteUserButton from '@/components/DeleteUserButton';
import { notFound } from 'next/navigation';

function Page(): ReactElement {
  const user = getUser();

  if (user == null) {
    return notFound();
  }

  return (
    <SmallPage title="User profile">
      <div className="mt-8">
        <h2>Danger zone</h2>
        <p className="mb-4">
          Permanently delete group. This will not delete any of your bangers, only the group and remove any members from
          it.
        </p>
        <Suspense>
          <DeleteUserButton />
        </Suspense>
      </div>
    </SmallPage>
  );
}

export default Page;
