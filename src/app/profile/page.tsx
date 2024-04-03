import React, { ReactElement, Suspense } from 'react';
import { notFound } from 'next/navigation';

import { SmallPage } from '@/components/layout/Layouts';
import DeleteUserButton from '@/components/delete-user/DeleteUserButton';
import { getUser } from '@/server/user/user-service';

function Page(): ReactElement {
  const user = getUser();

  if (user == null) {
    return notFound();
  }

  return (
    <SmallPage
      title="User profile"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      <div className="mt-2 border border-dashed p-4 rounded">
        <h2 className="text-lg mb-4">Danger zone</h2>
        <p className="mb-4">Permanently delete your account. This action cannot be undone.</p>
        <p className="mb-4">All your data, including your songs, will be permanently deleted.</p>
        <Suspense>
          <DeleteUserButton />
        </Suspense>
      </div>
    </SmallPage>
  );
}

export default Page;
