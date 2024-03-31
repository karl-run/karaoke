'use server';

import { getUser } from '@/session/user';
import { createGroup, joinGroup } from '@/db/groups';

export async function createGroupAction(groupName: string, groupIcon: number): Promise<{ id: string } | null> {
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

export async function joinGroupAction(joinCode: string): Promise<{ id: string } | null> {
  const user = await getUser();

  if (!user) {
    throw new Error('You must be logged in to join a group');
  }

  try {
    return await joinGroup(joinCode, user.userId);
  } catch (e) {
    console.error(e);
    return null;
  }
}
