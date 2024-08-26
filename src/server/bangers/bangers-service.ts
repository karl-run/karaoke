import * as R from 'remeda'
import { unstable_cache as cache } from 'next/cache'

import { TrackResult } from 'server/spotify/types'
import { getUserBangers } from 'server/bangers/bangers-db'

export const getUserBangersCached = cache(async (userId: string) => getUserBangers(userId), ['user-bangers'], {
  revalidate: 600,
  tags: ['bangers'],
})

export { getUserBangers, getUserBangersCount } from 'server/bangers/bangers-db'

export async function getUserBangersRecord(userId: string): Promise<Record<string, TrackResult | null>> {
  const results = await getUserBangersCached(userId)

  return R.fromEntries(results)
}
