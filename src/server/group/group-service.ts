import { getUser } from 'server/user/user-service';
import { getGroupById } from 'server/group/group-db';

export async function getGroupForUser(groupId: string, _user = null) {
  const userPromise = _user || getUser();
  const [user, group] = await Promise.all([userPromise, getGroupById(groupId)]);

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
