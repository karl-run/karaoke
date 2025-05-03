import React, { ReactElement } from 'react'
import { Metadata } from 'next'

import { SmallPage } from '@/components/layout/Layouts'

export const metadata: Metadata = {
  title: 'Karaoke Match - Success',
}

interface Props {
  searchParams: Promise<{
    new: boolean
  }>
}

async function Page({ searchParams }: Props): Promise<ReactElement> {
  const { new: isNew } = await searchParams

  return (
    <SmallPage
      title={isNew ? 'Account created!' : 'Magic link sent... If you have an account.'}
      className="flex flex-col gap-8"
    >
      <p>Check your email on the device you want to log in to.</p>
      <p>The link is single use, so use it on the device you want to log in to!</p>
    </SmallPage>
  )
}

export default Page
