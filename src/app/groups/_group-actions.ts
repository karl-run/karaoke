'use server';

import { getUser } from '@/session/user';
import { createGroup } from '@/db/groups';

export async function createGroupAction(groupName: string): Promise<{ id: string } | null> {
  const user = await getUser();

  if (!user) {
    throw new Error('You must be logged in to create a group');
  }

  try {
    return await createGroup(user.userId, groupName, 1);
  } catch (e) {
    console.error(e);
    return null;
  }
}
