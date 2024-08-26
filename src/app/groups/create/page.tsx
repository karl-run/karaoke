import React, { ReactElement } from 'react'
import { redirect } from 'next/navigation'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SmallPage } from '@/components/layout/Layouts'
import { createGroupAction } from '@/app/groups/_group-actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import GroupAvatar from '@/components/avatar/GroupAvatar'

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
          'use server'

          const groupName = data.get('group-name')?.toString()
          const groupIcon = data.get('group-icon')?.toString()

          if (!groupName || !groupIcon) {
            throw new Error('Group name and icon is required')
          }

          const newGroup = await createGroupAction(groupName, +groupIcon)
          if (newGroup?.id) {
            redirect(`/groups/${newGroup.id}/details`)
          }

          console.error('Unable to create group')
        }}
        className="flex gap-3"
      >
        <Input name="group-name" placeholder="Group name" required type="text" maxLength={26} />
        <Select name="group-icon" required defaultValue="0">
          <SelectTrigger className="w-[96px] pl-0">
            <SelectValue placeholder="Icon" defaultValue="0" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 26 }, (_, i) => (
              <SelectItem key={i} value={`${i}`}>
                <GroupAvatar iconIndex={i} size="small" />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
  )
}

export default Page
