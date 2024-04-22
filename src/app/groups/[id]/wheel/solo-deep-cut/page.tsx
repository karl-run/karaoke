import React, { ReactElement, Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_noStore } from 'next/cache';
import { Metadata } from 'next';

import { getGroupForUser } from 'server/group/group-service';

import { SmallPage } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Karaoke Match - Spin the wheel!',
};

type Props = {
  params: {
    id: string;
  };
};

function Page({ params }: Props): ReactElement {
  return (
    <SmallPage
      title="Who wants it the most?"
      back={{
        to: `/groups/${params.id}/wheel`,
        text: 'Back to wheel selection',
      }}
    >
      <Suspense>
        <SoloDeepCut groupId={params.id} />
      </Suspense>
    </SmallPage>
  );
}

async function SoloDeepCut({ groupId }: { groupId: string }): Promise<ReactElement> {
  unstable_noStore();

  const userGroup = await getGroupForUser(groupId);

  if ('error' in userGroup) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-3 w-full sm:max-w-60">
      {userGroup.group.users.map((user) => (
        <Button key={user.safeId} asChild className="bg-blue-300 text-wrap h-20 text-lg w-full">
          <Link href={`/groups/${groupId}/wheel/spin?type=solo&luckyUser=${user.safeId}`}>{user.displayName}</Link>
        </Button>
      ))}
      <Button asChild className="bg-yellow-300 text-wrap h-20 text-lg w-full">
        <Link href={`/groups/${groupId}/wheel/spin?type=solo&luckyUser=random`}>Random!</Link>
      </Button>
    </div>
  );
}

export default Page;
