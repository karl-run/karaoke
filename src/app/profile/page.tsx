import * as R from 'remeda';
import React, { ReactElement, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

import { getUserBangersCount } from 'server/bangers/bangers-service';
import { getUserGroupCount } from 'server/group/group-db';
import { getAllSessions } from 'server/session/session-db';

import { SmallPage } from '@/components/layout/Layouts';
import DeleteUserButton from '@/components/delete-user/DeleteUserButton';
import { getUser } from '@/server/user/user-service';
import { Skeleton } from '@/components/ui/skeleton';
import InvalidateSessionButton from '@/components/sessions/InvalidateSessionButton';

async function Page(): Promise<ReactElement> {
  const user = await getUser();

  if (user == null) {
    return notFound();
  }

  return (
    <SmallPage
      title="User profile"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      <h2 className="text-lg mb-4">Your data</h2>
      <div>
        <div className="flex gap-1 items-center">
          You have banged
          <Suspense fallback={<Skeleton className="inline-block h-4 w-6" />}>
            <SongCount className="font-bold" userId={user.userId} />
          </Suspense>
          songs.
        </div>
        <div className="flex gap-1 items-center">
          You are a member of
          <Suspense fallback={<Skeleton className="inline-block h-4 w-6" />}>
            <GroupCount className="font-bold" userId={user.userId} />
          </Suspense>
          groups
        </div>
      </div>
      <h2 className="text-lg mb-4 mt-8">Your logins</h2>
      <p className="mb-4">
        You will be automatically logged out of any device after 30 days. You can manually log out any device from the
        list below.
      </p>
      <Suspense
        fallback={
          <div>
            <Skeleton className="h-8 w-20" />
          </div>
        }
      >
        <UserSessions userId={user.userId} sessionId={user.sessionId} />
      </Suspense>
      <div className="mt-4 border border-dashed p-4 rounded">
        <h2 className="text-lg mb-4">Danger zone</h2>
        <p className="mb-4">Permanently delete your account. This action cannot be undone.</p>
        <p className="mb-4">All your data, including your songs, will be permanently deleted.</p>
        <Suspense>
          <DeleteUserButton />
        </Suspense>
      </div>
    </SmallPage>
  );
}

async function SongCount({ className, userId }: { className?: string; userId: string }): Promise<ReactElement> {
  return <span className={className}>{await getUserBangersCount(userId)}</span>;
}

async function GroupCount({ className, userId }: { className?: string; userId: string }): Promise<ReactElement> {
  return <span className={className}>{await getUserGroupCount(userId)}</span>;
}

async function UserSessions({ userId, sessionId }: { userId: string; sessionId: string }): Promise<ReactElement> {
  const allSessions = await getAllSessions(userId);
  const sorted = R.pipe(
    allSessions,
    R.sortBy([(it) => it.sessionId === sessionId, 'desc'], [(it) => it.lastSeen, 'desc']),
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((it) => (
        <div key={it.sessionId} className="border p-2 rounded relative">
          <div className="text-sm">{formatDistanceToNow(it.lastSeen, { addSuffix: true })}</div>
          <div>
            {it.userAgent.browser.name} ({it.userAgent.os.name})
          </div>
          {it.sessionId !== sessionId ? (
            <InvalidateSessionButton userId={userId} sessionId={it.sessionId} />
          ) : (
            <div className="font-semibold text-sm absolute top-2 right-2">This session</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Page;
