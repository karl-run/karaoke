import React, { ReactElement } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

function Landing(): ReactElement {
  return (
    <div className="px-6 sm:px-20 mt-8 mb-8">
      <h1 className="text-3xl">Karaoke Match</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
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
              <Link className="underline" href="/signup">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Landing;
