import React, { ReactElement } from 'react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import ThemeToggler from './theme/ThemeToggler';

type Props = {
  name: string;
  id: string;
};

function UserDropdownAvatar({ name, id }: Props): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/bangers">Bangers</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/groups">Groups</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeToggler />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>User</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/logout" prefetch={false}>Log out</Link>
        </DropdownMenuItem>
        {id === process.env.ADMIN_ID && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Secret</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href="/admin" prefetch={false}>Admin stats</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdownAvatar;
