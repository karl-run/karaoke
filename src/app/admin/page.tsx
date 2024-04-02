import React, { ReactElement } from 'react';
import { notFound } from 'next/navigation';

import GroupAvatar from '@/components/avatar/GroupAvatar';
import { getUser } from '@/server/session/user';
import { getTotalBangersCount, getTotalGroupCount, getTotalUserCount } from '@/server/db/stats';
import { SmallPage } from '@/components/layout/Layouts';
import { Label } from '@/components/ui/label';

async function Page(): Promise<ReactElement> {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  if (process.env.ADMIN_ID == null) {
    console.error('ADMIN_ID is not configured, admin page is inaccessible');
    notFound();
  }

  if (user.userId !== process.env.ADMIN_ID) {
    notFound();
  }

  const [bangers, users, groups] = await Promise.all([
    getTotalBangersCount(),
    getTotalUserCount(),
    getTotalGroupCount(),
  ]);

  return (
    <SmallPage title="Hidden admin stats">
      <div className="flex flex-col gap-3">
        <StatWithAvatar iconIndex={32} label="Total bangers" value={bangers} />
        <StatWithAvatar iconIndex={29} label="Total users" value={users} />
        <StatWithAvatar iconIndex={28} label="Total groups" value={groups} />
      </div>
    </SmallPage>
  );
}

function StatWithAvatar({
  iconIndex,
  label,
  value,
}: {
  iconIndex: number;
  label: string;
  value: number;
}): ReactElement {
  return (
    <div className="flex gap-3 items-center">
      <GroupAvatar iconIndex={iconIndex} />
      <div>
        <Label>{label}</Label>
        <div>{value}</div>
      </div>
    </div>
  );
}

export default Page;
