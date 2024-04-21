import { unstable_cache as cache } from 'next/cache';

import { getUser } from 'server/user/user-service';

import * as groupDb from './group-db';

export async function getGroupForUser(groupId: string, _user = null) {
  const userPromise = _user || getUser();
  const [user, group] = await Promise.all([userPromise, groupDb.getGroupById(groupId)]);

  if (user == null) {
    return { error: 'not-logged-in' };
  }

  if (group == null) {
    return { error: 'no-such-group' };
  }

  if (group.users.find((u) => u.userId === user?.userId) == null) {
    return { error: 'not-member' };
  }

  return { group, user };
}

export const getUsersGroupsCached = cache(async (userId: string) => groupDb.getUserGroups(userId), ['user-groups'], {
  revalidate: 600,
  tags: ['groups'],
});
