import { notFound } from 'next/navigation';
import React, { ReactElement } from 'react';

import { getUser } from 'server/user/user-service';
import { getPlaylistWithTracks } from 'server/spotify/playlist';

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

  const exampleBangers = await getPlaylistWithTracks('2ydyIaxEYvkMtefJBIIEqK');

  if ('errorMessage' in exampleBangers) {
    return (
      <SmallPage title="Bangscoverer!">
        <div className="text-lg opacity-70">Error fetching possible tracks</div>
        <p className="mt-8">{exampleBangers.errorMessage}</p>
      </SmallPage>
    );
  }

  return (
    <SmallPage title="Bangscoverer!">
      <Swiper track={exampleBangers.tracks[Math.floor(Math.random() * exampleBangers.tracks.length)]!} />
    </SmallPage>
  );
}

export default Page;
