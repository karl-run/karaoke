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
  loading: () => <SwiperLanding mode="landing" />,
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Karaoke Match - Explore',
};

type Props = {
  searchParams: {
    more: string;
  };
};

async function Page({ searchParams: { more } }: Props): Promise<ReactElement> {
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
        <Suspense key={more ?? '0'} fallback={<SwiperLanding mode="landing" />}>
          <SwiperWithData userId={user.userId} />
        </Suspense>
      </SwiperWrapper>
    </SmallPage>
  );
}

async function SwiperWithData({ userId }: { userId: string }): Promise<ReactElement> {
  const trackSuggestions = await getSuggestions(userId, 30);

  if (trackSuggestions.length === 0) {
    return <SwiperLanding mode="empty" />;
  }

  return <Swiper suggestions={trackSuggestions} />;
}

export default Page;
