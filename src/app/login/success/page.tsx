import React, { ReactElement } from 'react';

interface Props {
  searchParams: {
    new: boolean;
  };
}

function Page({ searchParams }: Props): ReactElement {
  return (
    <div className="container">
      <div className="p-8 max-w-prose flex flex-col gap-8">
        {searchParams.new ? (
          <h1 className="text-xl">Account created!</h1>
        ) : (
          <h1 className="text-xl">Magic link sent... If you have an account.</h1>
        )}
        <p>Check your email on the device you want to log in to.</p>
        <p>The link is single use, so use it on the device you want to log in to!</p>
      </div>
    </div>
  );
}

export default Page;
