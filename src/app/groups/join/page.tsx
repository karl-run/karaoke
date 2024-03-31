import React, { ReactElement } from 'react';
import { SmallPage } from '@/components/layout/Layouts';

function Page(): ReactElement {
  return (
    <SmallPage
      title="Join a group"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
    >
      TODO
    </SmallPage>
  );
}

export default Page;
