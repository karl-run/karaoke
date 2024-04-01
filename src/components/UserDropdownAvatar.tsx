import React, { ReactElement } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import ThemeToggler from './ThemeToggler';

type Props = {
  name: string;
};

function UserDropdownAvatar({ name }: Props): ReactElement {
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
          <Link href="/logout">Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdownAvatar;
