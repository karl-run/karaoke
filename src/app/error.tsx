'use client';

import { useEffect } from 'react';

import { SmallPage } from '@/components/layout/Layouts';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SmallPage
      title="OOPSIE WOOPSIE!! Uwu we made a oowie woowie :("
      back={{
        text: 'Back to home',
        to: '/',
      }}
    >
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </SmallPage>
  );
}
