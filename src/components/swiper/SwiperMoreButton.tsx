'use client'

import React, { ReactElement, useTransition } from 'react'
import { useQueryState } from 'nuqs'

import { Button } from '@/components/ui/button'

function SwiperMoreButton(): ReactElement {
  const [pending, startTransition] = useTransition()
  const [more, setMore] = useQueryState('more', {
    startTransition,
    defaultValue: '0',
    clearOnDefault: true,
  })

  return (
    <Button
      variant="default"
      type="button"
      size="lg"
      className="bg-green-200"
      disabled={pending}
      onClick={() => {
        setMore(`${+more + 1}`)
      }}
    >
      Give me more!
    </Button>
  )
}

export default SwiperMoreButton
