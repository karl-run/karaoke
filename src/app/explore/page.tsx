import { notFound } from 'next/navigation';
import React, { ReactElement } from 'react';

import { getUser } from 'server/user/user-service';
import { getSuggestions } from 'server/bangers/suggestions-service';

import Swiper from '@/components/swiper/Swiper';
import { SmallPage } from '@/components/layout/Layouts';

async function Page(): Promise<ReactElement> {
  const user = await getUser();

  if (!user) {
    notFound();
  }

  if (user.userId !== process.env.ADMIN_ID) {
    notFound();
  }

  // TODO: Suspense loading state
  const trackSuggestions = await getSuggestions(user.userId, 25);
  return (
    <SmallPage title="Bangscoverer!" className="overflow-hidden">
      <Swiper suggestions={trackSuggestions} />
    </SmallPage>
  );
}

export default Page;
