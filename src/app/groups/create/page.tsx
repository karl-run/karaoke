import React, { ReactElement } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmallPage } from '@/components/layout/Layouts';
import { createGroupAction } from '@/app/groups/_group-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';

function Page(): ReactElement {
  return (
    <SmallPage
      title="Create a group"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
      className="flex flex-col gap-8"
    >
      <form
        action={async (data) => {
          'use server';

          const groupName = data.get('group-name')?.toString();

          if (!groupName) {
            throw new Error('Group name is required');
          }

          const newGroup = await createGroupAction(groupName);
          if (newGroup?.id) {
            redirect(`/groups/${newGroup.id}/details`);
          }

          console.error('Unable to create group');
        }}
        className="flex gap-3"
      >
        <Input name="group-name" placeholder="Group name" required type="text" maxLength={26} />
        <Input
          name="group-icon"
          placeholder="Group avatar"
          required
          defaultValue={1}
          type="number"
          maxLength={1}
          disabled
          className="max-w-12"
        />
        <Button>Create group</Button>
      </form>
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Creating groups</AlertTitle>
        <AlertDescription>
          After creating a group, you will get a link that you can share with your friends to join the group.
        </AlertDescription>
      </Alert>
    </SmallPage>
  );
}

export default Page;
