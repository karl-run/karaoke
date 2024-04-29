import React, { ReactElement } from 'react';
import { Metadata } from 'next';

import {
  getTotalBangersCount,
  getTotalCacheCount,
  getTotalDismissCount,
  getTotalGroupCount,
  getTotalUserCount,
} from 'server/db/stats';

import GroupAvatar from '@/components/avatar/GroupAvatar';
import { SmallPage } from '@/components/layout/Layouts';
import { Label } from '@/components/ui/label';
import { verifyUserIsAdmin } from '@/app/admin/_admin-utils';

export const metadata: Metadata = {
  title: 'Karaoke Match - Admin',
};

async function Page(): Promise<ReactElement> {
  await verifyUserIsAdmin();

  const [bangers, users, groups, dismiss, cache] = await Promise.all([
    getTotalBangersCount(),
    getTotalUserCount(),
    getTotalGroupCount(),
    getTotalDismissCount(),
    getTotalCacheCount(),
  ]);

  return (
    <SmallPage title="Hidden admin stats">
      <div className="flex flex-col gap-3">
        <StatWithAvatar iconIndex={32} label="Total bangers" value={bangers} />
        <StatWithAvatar iconIndex={29} label="Total users" value={users} />
        <StatWithAvatar iconIndex={28} label="Total groups" value={groups} />
        <div className="border-b-2" />
        <StatWithAvatar iconIndex={27} label="Dismissed explores" value={dismiss} />
        <StatWithAvatar iconIndex={26} label="Normalized cache size" value={cache} />
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
