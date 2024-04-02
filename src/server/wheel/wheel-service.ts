import * as R from 'remeda';
import * as z from 'zod';

import { getGroupById } from 'server/group/group-db';
import { getUserBangers, getUsersUniqueSongs } from 'server/bangers/bangers-db';
import { TrackResult } from 'server/spotify/types';
import { getUserBySafeId } from 'server/user/user-db';

import { raise } from 'utils/ts';

export type WheelParams = z.infer<typeof WheelParamsSchema>;
export const WheelParamsSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('solo'),
    luckyUser: z.string(),
  }),
]);

/**
 * 1: Song with the most users
 * 2: Song with 2 or more, but not top
 * 3: Song with ONLY 1 user
 */
export async function getSpecialSongInGroup(
  groupId: string,
  // eslint-disable-next-line no-unused-vars
  params: WheelParams,
) {
  const group = await getGroupById(groupId);
  const bangs = await getUserBangers(group!.users[0].userId);

  /*
    TODO:

    When solo bangers (3), first pick a random person, then pick a random song from their bangers that is unique to them
    When multiple bangers(1), get the top 10 songs, look at distribution of users, pick the song that fits the type
    When normal(2), TODO
   */
  return bangs[0][1];
}

export async function getSpecialSongForSolo(groupId: string, luckyUserSafeId: string) {
  const user = await getUserBySafeId(luckyUserSafeId);
  if (user == null) {
    raise(`Illegal state: User not found for safe id ${luckyUserSafeId}`);
  }

  const bangs = await getUsersUniqueSongs(user.email, groupId);
  const tracks = R.pipe(
    bangs,
    // For simplicity's sake, we'll remove any tracks that haven't been cached yet
    R.filter((tuple): tuple is [string, TrackResult] => tuple[1] != null),
    R.map(([, track]) => track),
  );

  if (tracks.length === 0) {
    return [null, user] as const;
  }

  return [pickRandomSong(tracks), user] as const;
}

function pickRandomSong(tracks: TrackResult[]) {
  return tracks[Math.floor(Math.random() * tracks.length)];
}
