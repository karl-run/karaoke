import React, { ReactElement } from 'react';
import Link from 'next/link';

function Page(): ReactElement {
  return (
    <div className="container">
      <div className="p-8 max-w-prose flex flex-col gap-8">
        <h1 className="text-xl">Unable to log you in.</h1>
        <p>The magic link you used might have been expired.</p>
        <p>Please try logging in again to receive a new magic link. If you have any issues, please contact support.</p>
        <Link href="/login">Go back to login</Link>
      </div>
    </div>
  );
}

export default Page;
