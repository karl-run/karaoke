import React, { ReactElement } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmallPage } from '@/components/layout/Layouts';

function Page(): ReactElement {
  return (
    <SmallPage
      title="Create a group"
      back={{
        to: '/groups',
        text: 'Back to groups',
      }}
    >
      <form
        action={async (data) => {
          'use server';

          const groupName = data.get('group-name')?.toString();

          if (!groupName) {
            throw new Error('Group name is required');
          }

          const newGroup = await createGroup(groupName);

          redirect(`/groups/${newGroup.id}`);
        }}
        className="flex gap-3"
      >
        <Input name="group-name" placeholder="Group name" required type="text" />
        <Button>Create group</Button>
      </form>
    </SmallPage>
  );
}

export default Page;
