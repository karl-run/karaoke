'use client'

import React, { ReactElement, startTransition } from 'react'
import { UpdateIcon } from '@radix-ui/react-icons'

import { invalidateInviteLinkAction } from '@/app/groups/_group-actions'
import { Button } from '@/components/ui/button'

type Props = {
  groupId: string
}

function InvalidateInviteLink({ groupId }: Props): ReactElement {
  return (
    <Button
      variant="outline"
      onClick={() => {
        startTransition(() => {
          invalidateInviteLinkAction(groupId)
        })
      }}
    >
      <UpdateIcon className="h-4 w-4" />
    </Button>
  )
}

export default InvalidateInviteLink
