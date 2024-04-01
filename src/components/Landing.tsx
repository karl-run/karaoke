import React, { ReactElement, Suspense } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { getActiveSession } from '@/db/sessions';
import { getSessionId } from '@/session/user';
import GroupAvatar from '@/components/avatar/GroupAvatar';

function Landing(): ReactElement {
  return (
    <div className="px-6 sm:px-20 mt-8 mb-8">
      <h1 className="text-3xl">Karaoke Match</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-3">
              <MagnifyingGlassIcon className="h-6 w-6" />
              Search songs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Match your favourite tracks with your friends</p>
          </CardContent>
          <CardFooter>
            <p>
              Use shortcut <code className="inline mx-2">CMD+K</code> (<code className="inline mx-2">CTRL+K</code>) to
              search
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Join groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Be a part of multiple groups, your bangers will apply across all groups.</p>
            <div className="flex gap-2 mt-2">
              <Link className="underline" href="/groups/join">
                Join group
              </Link>
              <p>or</p>
              <Link className="underline" href="/groups/create">
                create group
              </Link>
            </div>
          </CardContent>
        </Card>
        <Suspense>
          <LogInNowCard />
        </Suspense>
      </div>
    </div>
  );
}

async function LogInNowCard() {
  const activeSession = await getActiveSession(getSessionId());

  if (activeSession != null) {
    return (
      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <GroupAvatar iconIndex={0} size="small" />
            Find your groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You are signed in and ready to go!</p>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-2">
            <Link className="underline" href="/groups">
              Go to your groups
            </Link>
            <p>or</p>
            <Link className="underline" href="/bangers">
              take a look at your bangers list.
            </Link>
          </div>
          <p className="mt-4">You can always find these in the top right corner menu.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 sm:col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Log in now</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Log in now to start matching your favourite tracks</p>
        <div className="flex gap-2 mt-2">
          <Link className="underline" href="/login">
            Log in
          </Link>
          <p>or</p>
          <Link className="underline" href="/register">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default Landing;
