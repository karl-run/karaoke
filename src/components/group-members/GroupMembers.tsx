'use client';

import React, { ReactElement, useTransition } from 'react';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { useRouter } from 'next/navigation';

import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

type Props = {
  members: {
    name: string;
    safeId: string;
    bangers: number;
  }[];
};

function GroupMembers({ members }: Props): ReactElement {
  const router = useRouter();
  const [transition, startTransition] = useTransition();
  const [ignored, setIgnored] = useQueryState(
    'ignored',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      startTransition,
      throttleMs: 1500,
      clearOnDefault: true,
    }),
  );

  const memberIds = members.map((it) => it.safeId);
  const activeMembers = memberIds.filter((it) => !ignored.includes(it));

  return (
    <div className="mb-2">
      <div className="text-xs mb-1">Active members</div>
      <ToggleGroup
        variant="outline"
        type="multiple"
        className="flex w-full justify-start flex-wrap"
        value={activeMembers}
        disabled={transition}
        onValueChange={(it) => {
          const remainingIds = memberIds.filter((id) => !it.includes(id));

          setIgnored(remainingIds);
        }}
      >
        {members.map((member) => (
          <ToggleGroupItem
            key={member.safeId}
            className="flex flex-col h-14 w-1/3 xs:w-1/4 sm:w-auto grow sm:grow-0"
            value={member.safeId}
            onContextMenu={(event) => {
              event.preventDefault();
              router.push(`/user/${member.safeId}`);
            }}
          >
            <div className="truncate max-w-16 font-bold">{member.name}</div>
            <div className="text-xs">{member.bangers} songs</div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default GroupMembers;
