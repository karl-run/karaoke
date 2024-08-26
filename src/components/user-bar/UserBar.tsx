import React, { ReactElement, Suspense } from 'react'
import Link from 'next/link'

import { getUser } from 'server/user/user-service'

import { cn } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'
import { Skeleton } from '@/components/ui/skeleton'
import UserDropdownAvatar from '@/components/UserDropdownAvatar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import GroupAvatar from '@/components/avatar/GroupAvatar'

import styles from './UserBar.module.css'

function UserBar(): ReactElement {
  return (
    <div className={cn(styles.gridContainer, 'container')}>
      <div className={styles.logo}>
        <Link href="/" aria-label="Home">
          <GroupAvatar iconIndex={Math.floor(Math.random() * 36)} />
        </Link>
      </div>
      <div className={styles.search}>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
      <div className={styles.userDetails}>
        <Button asChild size="sm" variant="outline" className="hidden sm:flex">
          <Link href="/groups">Groups</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="hidden sm:flex">
          <Link href="/bangers">Bangers</Link>
        </Button>
        <Suspense fallback={<UserDetailsSkeleton />}>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  )
}

async function UserDetails() {
  const user = await getUser()

  if (!user) return <NotLoggedIn />

  return (
    <div className="flex gap-3 items-center justify-end h-full p-3 shrink-0">
      <div>
        <div className="text-xs">Logged in</div>
        <div className="truncate">{user.name}</div>
      </div>
      <UserDropdownAvatar name={user.name} id={user.userId} />
    </div>
  )
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
  )
}

function NotLoggedIn() {
  return (
    <div className="flex gap-2 xs:gap-6 flex-col-reverse xs:flex-row items-center justify-between sm:justify-end h-full p-3">
      <Link className="underline shrink-0" href="/login">
        Log in
      </Link>
      <Link className="underline shrink-0" href="/register">
        Register
      </Link>
    </div>
  )
}

export default UserBar
