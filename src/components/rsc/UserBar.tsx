import React, { ReactElement, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import logo from '@/images/logo.png';
import SearchBar from '@/components/SearchBar';
import { getUserDetails } from '@/db/users';
import { cookies } from 'next/headers';
import { Skeleton } from '@/components/ui/skeleton';

import styles from './UserBar.module.css';
import UserDropdownAvatar from '@/components/UserDropdownAvatar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

function UserBar(): ReactElement {
  return (
    <div className={cn(styles.gridContainer, 'container')}>
      <div className={styles.logo}>
        <Link href="/">
          <Image className="h-10 w-10" src={logo} alt="" height="48" width="48" priority />
        </Link>
      </div>
      <div className={styles.search}>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
      <div className={styles.userDetails}>
        <Button asChild size="sm" variant="outline">
          <Link href="/groups">Groups</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/bangers">Bangers</Link>
        </Button>
        <Suspense fallback={<UserDetailsSkeleton />}>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  );
}

async function UserDetails() {
  const session = cookies().get('session')?.value;

  if (!session) return <NotLoggedIn />;

  const user = await getUserDetails(session);

  if (!user) return <NotLoggedIn />;

  return (
    <div className="flex gap-3 items-center justify-end h-full p-3 shrink-0">
      <div>
        <div className="text-xs">Logged in</div>
        <div className="truncate">{user.name}</div>
      </div>
      <UserDropdownAvatar name={user.name} />
    </div>
  );
}

function UserDetailsSkeleton() {
  return (
    <div className="flex gap-3 items-center justify-end h-full p-3">
      <div>
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-4 w-16 mt-2" />
      </div>
      <Avatar>
        <AvatarFallback />
      </Avatar>
    </div>
  );
}

function NotLoggedIn() {
  return (
    <div className="flex gap-6 items-center justify-between sm:justify-end h-full p-3">
      <Link className="underline" href="/login">
        Log in
      </Link>
      <Link className="underline" href="/register">
        Register
      </Link>
    </div>
  );
}

export default UserBar;
