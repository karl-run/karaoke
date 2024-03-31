import React, { ReactElement } from 'react';
import { SmallPage } from '@/components/layout/Layouts';

function Page(): ReactElement {
  return (
    <SmallPage
      title="My groups"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      TODO
    </SmallPage>
  );
}

export default Page;
