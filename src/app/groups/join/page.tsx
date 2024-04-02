import React, { ReactElement, Suspense } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SmallPage } from '@/components/layout/Layouts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getGroupByJoinCode, isUserInGroup } from '@/server/db/groups';
import { joinGroupAction } from '@/app/groups/_group-actions';
import { getUser } from '@/server/session/user';
import GroupAvatar from '@/components/avatar/GroupAvatar';

type Props = {
  searchParams: {
    code: string;
  };
};

function Page({ searchParams }: Props): ReactElement {
  const code = searchParams.code ?? null;

  return (
    <SmallPage
      title="Join a group"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
      className="flex flex-col gap-8"
    >
      {code == null ? (
        <JoinForm />
      ) : (
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-36" />
            </div>
          }
        >
          <JoinInvite code={code} />
        </Suspense>
      )}
    </SmallPage>
  );
}

function JoinForm(): ReactElement {
  return (
    <>
      <form
        action={async (data) => {
          'use server';

          const code = data.get('join-code')?.toString() as string;

          const result = await joinGroupAction(code);

          if (result == null) {
            console.error('Unable to join group');
            return;
          }

          redirect(`/groups/${result.id}/details`);
        }}
        className="flex items-end gap-3"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="join-code">Join code</Label>
          <Input
            id="join-code"
            name="join-code"
            placeholder="Enter join code"
            required
            type="text"
            minLength={36}
            maxLength={36}
          />
        </div>
        <Button>Join group</Button>
      </form>
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Missing the join code?</AlertTitle>
        <AlertDescription>
          Ask your friend that created the group for the join code. They can find it in the group settings.
        </AlertDescription>
        <AlertDescription className="mt-4">
          If you do not have a join code, you can{' '}
          <Link className="underline" href="/groups/create">
            create a new group
          </Link>{' '}
          instead.
        </AlertDescription>
      </Alert>
    </>
  );
}

async function JoinInvite({ code }: { code: string }): Promise<ReactElement> {
  const [group, user] = await Promise.all([getGroupByJoinCode(code), getUser()]);

  if (group == null) {
    return (
      <Alert>
        <AlertTitle>Invalid join code</AlertTitle>
        <AlertDescription>
          The join code you entered is invalid. Please double-check the link you followed and try again.
        </AlertDescription>
        <AlertDescription className="mt-4">The code might be expired.</AlertDescription>
      </Alert>
    );
  }

  if (user == null) {
    return (
      <Alert>
        <AlertTitle>Log in to join</AlertTitle>
        <AlertDescription>
          You must be logged in to join a group. Please{' '}
          <Link href="/login" className="underline">
            log in
          </Link>{' '}
          or{' '}
          <Link href="/register" className="underline">
            create an account
          </Link>{' '}
          to join this group.
        </AlertDescription>
      </Alert>
    );
  }

  const userInGroup = await isUserInGroup(user.userId, code);
  if (userInGroup != null) {
    return (
      <Alert>
        <AlertTitle>Already in the group</AlertTitle>
        <AlertDescription>
          You are already a member of this group.{' '}
          <Link href={`/groups/${userInGroup.id}/bangers`} className="underline">
            View group
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div>
        <h2>You have been invited to join:</h2>
        <div className="font-bold flex items-center gap-3 mt-4">
          <GroupAvatar iconIndex={group.iconIndex} />
          {group.name}
        </div>
      </div>
      <form
        action={async () => {
          'use server';

          const result = await joinGroupAction(code);

          if (result == null) {
            console.error('Unable to join group');
            return;
          }

          redirect(`/groups/${result.id}/details`);
        }}
      >
        <Button>Join {group.name}</Button>
      </form>
    </>
  );
}

export default Page;
