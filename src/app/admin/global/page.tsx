import React, { ReactElement } from 'react';

import { db, globalBangers } from 'server/db';

import { getVerifiedAdmin } from '@/app/admin/_admin-utils';

async function Page(): Promise<ReactElement> {
  await getVerifiedAdmin();

  const globals = await db.select().from(globalBangers);

  return (
    <div>
      <div>There are {globals.length} global bangers</div>
    </div>
  );
}

export default Page;
