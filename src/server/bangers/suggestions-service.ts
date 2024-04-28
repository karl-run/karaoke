import * as R from 'remeda';

import { TrackResult } from 'server/spotify/types';
import { getCoGroupMemberBangers, getGlobalBangers } from 'server/bangers/suggestions-db';

export async function getSuggestions(
  userId: string,
  count: number = 10,
): Promise<{ track: TrackResult; suggestedBy: string[] }[]> {
  const [globalSuggestions, coMemberBangers] = await Promise.all([
    getGlobalBangers(userId, count / 2),
    getCoGroupMemberBangers(userId, count / 2),
  ]);

  const globalClean = R.pipe(
    globalSuggestions,
    R.map((it) => it.normalized_song_cache?.data ?? null),
    R.filter(R.isTruthy),
    R.map((it) => ({
      track: it,
      suggestedBy: ['global'],
    })),
  );
  const coMemberClean = R.pipe(
    coMemberBangers,
    R.filter((it) => it.track != null),
  );

  return R.pipe(R.concat(globalClean, coMemberClean), R.shuffle());
}

export { dismissSuggestion } from './suggestions-db';
