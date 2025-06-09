import { Metadata } from 'next'
import { ReactElement } from 'react'

import { GroupMemberBangers } from '@/components/group-member-bangers/group-member-bangers'
import { FullPage } from '@/components/layout/Layouts'

export const metadata: Metadata = {
  title: 'Karaoke Match - Friend',
}

type Props = {
  params: Promise<{
    userId: string
  }>
  searchParams: Promise<{
    returnTo: string
  }>
}

async function Page({ params, searchParams }: Props): Promise<ReactElement> {
  const { returnTo } = await searchParams
  const { userId: safeId } = await params

  return (
    <FullPage
      title={`Bangers for this absolute ${getRandomGoodWord()}`}
      back={
        returnTo
          ? {
              to: `/groups/${returnTo}`,
              text: 'Back to group',
            }
          : {
              to: '/groups',
              text: 'Back to groups',
            }
      }
    >
      <GroupMemberBangers safeId={safeId} />
    </FullPage>
  )
}

function getRandomGoodWord() {
  const goodWords = ['legend', 'champion', 'hero', 'master', 'genius']
  return goodWords[Math.floor(Math.random() * goodWords.length)]
}

export default Page
