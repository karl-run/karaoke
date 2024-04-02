import { getGroup } from '@/server/db/groups';
import { getUserBangers } from '@/server/db/song-cache';

/**
 * 1: Song with the most users
 * 2: Song with 2 or more, but not top
 * 3: Song with ONLY 1 user
 */
export async function getSpecialSongInGroup(groupId: string, type: '1' | '2' | '3') {
  const group = await getGroup(groupId);

  const bangs = await getUserBangers(group!.users[0].userId);

  /*
    TODO:

    When solo bangers (3), first pick a random person, then pick a random song from their bangers that is unique to them
    When multiple bangers(1), get the top 10 songs, look at distribution of users, pick the song that fits the type
    When normal(2), TODO
   */
  return bangs[0][1];
}
