import * as R from 'remeda';
import React, { ReactElement } from 'react';
import { notFound } from 'next/navigation';
import GroupAvatar from '@/components/avatar/GroupAvatar';

function Page(): ReactElement {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return (
    <div className="flex">
      <div className="grid grid-cols-6 gap-3 p-4">
        {R.range(0, 36).map((index) => (
          <GroupAvatar iconIndex={index} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Page;
