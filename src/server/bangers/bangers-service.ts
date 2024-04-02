import * as R from 'remeda';

import { TrackResult } from 'server/spotify/types';
import { getUserBangers } from 'server/bangers/bangers-db';

export async function getUserSongMap(userId: string): Promise<Record<string, TrackResult | null>> {
  const results = await getUserBangers(userId);

  return R.fromEntries(results);
}
