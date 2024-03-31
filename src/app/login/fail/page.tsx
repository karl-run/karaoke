import React, { ReactElement } from 'react';
import Link from 'next/link';
import { SmallPage } from '@/components/layout/Layouts';

function Page(): ReactElement {
  return (
    <SmallPage
      title="Unable to log you in."
      className="flex flex-col gap-8"
      back={{
        to: '/login',
        text: 'Back to login',
      }}
    >
      <p>The magic link you used might have been expired.</p>
      <p>Please try logging in again to receive a new magic link. If you have any issues, please contact support.</p>
      <Link href="/login">Go back to login</Link>
    </SmallPage>
  );
}

export default Page;
