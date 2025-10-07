import { Link } from '@tanstack/react-router'
import type { ReactElement } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import ThemeToggler from './theme/ThemeToggler'

type Props = {
  name: string
  id: string
}

function UserDropdownAvatar({ name, id }: Props): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Your</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link to="/bangers">Bangers</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/groups">Groups</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeToggler />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>User</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/logout" prefetch={false}>
            Log out
          </Link>
        </DropdownMenuItem>
        {id === process.env.ADMIN_ID && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Secret</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to="/admin" prefetch={false}>
                Admin stats
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/admin/global" prefetch={false}>
                Global bangers
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdownAvatar
