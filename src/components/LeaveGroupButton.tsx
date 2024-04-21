'use client';

import React, { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { leaveGroupAction } from '@/app/groups/_group-actions';

type Props = {
  groupId: string;
};

function LeaveGroupButton({ groupId }: Props): ReactElement {
  const [transition, startTransition] = React.useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Leave group</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will no longer be a member of this group.
          </AlertDialogDescription>
          <AlertDialogDescription>
            You can be invited back to the group with the a new invite link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={transition}
            onClick={() => {
              startTransition(async () => {
                await leaveGroupAction(groupId);
              });
            }}
          >
            Yes, leave group
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LeaveGroupButton;
