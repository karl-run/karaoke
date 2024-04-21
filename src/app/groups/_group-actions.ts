'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';

import { getUser } from 'server/user/user-service';
import { createGroup, deleteGroup, getGroupById, joinGroup } from 'server/group/group-db';

export async function createGroupAction(groupName: string, groupIcon: number): Promise<{ id: string } | null> {
  const user = await getUser();

  if (!user) {
    throw new Error('You must be logged in to create a group');
  }

  try {
    return await createGroup(user.userId, groupName, groupIcon);
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
    const result = await joinGroup(joinCode, user.userId);

    revalidateTag('user-groups');

    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteGroupAction(groupId: string): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    throw new Error('You must be logged in to delete a group');
  }

  const group = await getGroupById(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  const admin = group.users.find((it) => it.role === 'admin');

  if (!admin) {
    throw new Error('Group does not have an admin');
  }

  if (admin.userId !== user.userId) {
    throw new Error('You must be an admin to delete a group');
  }

  await deleteGroup(groupId);
  revalidateTag('user-groups');
  redirect('/groups');
}
