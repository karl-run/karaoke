'use client'

import React, { ReactElement, startTransition } from 'react'

import { Button } from '@/components/ui/button'

import { invalidateSession } from './SessionActions'

type Props = {
  userId: string
  sessionId: string
}

function InvalidateSessionButton({ sessionId, userId }: Props): ReactElement {
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-2 right-2 h-12"
      onClick={() => {
        startTransition(() => {
          invalidateSession(userId, sessionId)
        })
      }}
    >
      Log out
    </Button>
  )
}

export default InvalidateSessionButton
