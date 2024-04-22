'use client';

import React, { ReactElement } from 'react';
import Link from 'next/link';
import { EnterIcon, FileIcon } from '@radix-ui/react-icons';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

function BangersExtraActions(): ReactElement {
  return (
    <div className="flex gap-3">
      <Button variant="outline" asChild className="hidden sm:flex gap-2">
        <Link prefetch={false} href="/bangers/m3u8">
          <FileIcon />
          Import .m3u8 file
        </Link>
      </Button>
      <Button variant="outline" asChild className="hidden sm:flex gap-2">
        <Link prefetch={false} href="/bangers/import">
          <EnterIcon />
          Import from Spotify
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="sm:hidden">
          <Button variant="outline" size="icon" aria-label="Imports">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Import</DropdownMenuLabel>
          <DropdownMenuItem asChild className="flex gap-2">
            <Link prefetch={false} href="/bangers/import">
              <EnterIcon />
              Import from Spotify
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex gap-2">
            <Link prefetch={false} href="/bangers/m3u8">
              <FileIcon />
              Import .m3u8 file
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default BangersExtraActions;
