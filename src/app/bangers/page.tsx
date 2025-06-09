'use client'

import { ReactElement, Suspense } from 'react'

import BangersExtraActions from '@/components/bangers/BangersExtraActions'
import { Bangers } from '@/components/bangers/bangers'
import { FullPage } from '@/components/layout/Layouts'

function Page(): ReactElement {
  return (
    <FullPage title="My bangers" back="search" actions={<BangersExtraActions />}>
      <Suspense>
        <Bangers />
      </Suspense>
    </FullPage>
  )
}

export default Page
