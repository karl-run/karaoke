import { notFound } from 'next/navigation';
import React, { ReactElement, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

import { getUser } from 'server/user/user-service';
import { getSuggestions } from 'server/bangers/suggestions-service';

import { SmallPage } from '@/components/layout/Layouts';
import SwiperExtraActions from '@/components/swiper/SwiperExtraActions';
import SwiperWrapper from '@/components/swiper/SwiperWrapper';
import { SwiperLanding } from '@/components/swiper/SwiperLanding';

const Swiper = dynamic(() => import('@/components/swiper/Swiper'), {
  loading: () => <SwiperLanding />,
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Karaoke Match - Explore',
};

async function Page(): Promise<ReactElement> {
  const user = await getUser();

  if (!user) {
    notFound();
  }

  return (
    <SmallPage
      title="Explore"
      tightTitle
      actions={<SwiperExtraActions />}
      back={{
        text: 'Back to bangers',
        to: '/bangers',
      }}
    >
      <SwiperWrapper>
        <Suspense fallback={<SwiperLanding />}>
          <SwiperWithData userId={user.userId} />
        </Suspense>
      </SwiperWrapper>
    </SmallPage>
  );
}

async function SwiperWithData({ userId }: { userId: string }): Promise<ReactElement> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const trackSuggestions = await getSuggestions(userId, 30);

  return <Swiper suggestions={trackSuggestions} />;
}

export default Page;
