import React, { ReactElement, Suspense } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { getUserBangersRecord } from 'server/bangers/bangers-service';

import { SmallPage } from '@/components/layout/Layouts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ImportFromM3U8 from '@/components/import-from-m3u8/ImportFromM3U8';
import { Skeleton } from '@/components/ui/skeleton';
import { getUser } from '@/server/user/user-service';

function Page(): ReactElement {
  return (
    <SmallPage
      title="Import songs from m3u8 playlist file"
      back={{
        to: '/bangers',
        text: 'Back to bangers',
      }}
    >
      <Suspense
        fallback={
          <div className="p-4">
            <Skeleton className="h-20 w-1/2" />
          </div>
        }
      >
        <ImporterWithUserBangers />
      </Suspense>
    </SmallPage>
  );
}

async function ImporterWithUserBangers() {
  const user = await getUser();

  if (!user) {
    return (
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>You have to be logged in to import playlists.</AlertTitle>
        <AlertDescription>
          <Link href="/login">Login</Link> to import playlists.
        </AlertDescription>
      </Alert>
    );
  }

  const bangers = await getUserBangersRecord(user.userId);

  return <ImportFromM3U8 existingSongs={bangers} />;
}

export default Page;
