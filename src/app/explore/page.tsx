import { notFound } from 'next/navigation';
import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

import { getUser } from 'server/user/user-service';
import { getSuggestions } from 'server/bangers/suggestions-service';

import { SmallPage } from '@/components/layout/Layouts';
import SwiperExtraActions from '@/components/swiper/SwiperExtraActions';

const Swiper = dynamic(() => import('@/components/swiper/Swiper'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Karaoke Match - Explore new',
};

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
    <SmallPage
      title="Explore new"
      className="overflow-hidden"
      tightTitle
      actions={<SwiperExtraActions />}
      back={{
        text: 'Back to bangers',
        to: '/bangers',
      }}
    >
      <Swiper suggestions={trackSuggestions} />
    </SmallPage>
  );
}

export default Page;
