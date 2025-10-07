import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { type ReactElement, Suspense } from 'react'
import { getUser } from 'server/user/user-service'
import GroupAvatar from '@/components/avatar/GroupAvatar'
import UserDropdownAvatar from '@/components/UserDropdownAvatar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
/*import SearchBar from '@/components/SearchBar'*/
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import styles from './UserBar.module.css'

function UserBar(): ReactElement {
  return (
    <div className={cn(styles.gridContainer, 'container')}>
      <div className={styles.logo}>
        <Link to="/" aria-label="Home">
          <GroupAvatar iconIndex={Math.floor(Math.random() * 36)} />
        </Link>
      </div>
      <div className={styles.search}>
        {/*<Suspense fallback={null}>
					<div className={cn("transition-[max-height] p-3 max-h-16")}>
						<SearchBar />
						TODO search bar
					</div>
				</Suspense>*/}
      </div>
      <div className={styles.userDetails}>
        <Button asChild size="sm" variant="outline" className="hidden sm:flex">
          <Link to="/groups">Groups</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="hidden sm:flex">
          <Link to="/bangers">Bangers</Link>
        </Button>
        <Suspense fallback={<UserDetailsSkeleton />}>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  )
}

function UserDetails() {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })

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
      <Link className="underline shrink-0" to="/login">
        Log in
      </Link>
      <Link className="underline shrink-0" to="/register">
        Register
      </Link>
    </div>
  )
}

export default UserBar
