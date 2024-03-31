import { client } from '@/db/client';
import { generate16ByteHex, generate32ByteHex } from '@/utils/token';

export async function createGroup(userId: string, groupName: string, iconIndex: number) {
  const id = generate16ByteHex();
  const joinCode = generate32ByteHex();

  const transaction = await client.transaction('write');
  await client.execute({
    sql: `
            INSERT INTO user_group (id, join_key, name, icon_index, description)
            VALUES (?, ?, ?, ?, '')
        `,
    args: [id, joinCode, groupName, iconIndex],
  });
  await client.execute({
    sql: `
            INSERT INTO user_to_group (user_id, group_id, role)
            VALUES (?, ?, 'admin')
        `,
    args: [userId, id],
  });
  await transaction.commit();

  return {
    id,
  };
}

export async function getUserGroups(userId: string) {
  const groups = await client.execute({
    sql: `
            SELECT *
            FROM user_group
                     LEFT JOIN user_to_group ON user_group.id = user_to_group.group_id
            WHERE user_to_group.user_id = ?
        `,
    args: [userId],
  });

  return groups.rows.map((group) => ({
    id: group.id as string,
    name: group.name as string,
    joinKey: group.join_key as string,
    iconIndex: group.icon_index as number,
  }));
}

export async function getGroup(id: string) {
  const group = await client.execute({
    sql: `SELECT users.name as display_name, users.email, user_to_group.role, user_group.name, user_group.icon_index
          FROM user_group
                 LEFT JOIN user_to_group ON user_group.id = user_to_group.group_id
                 LEFT JOIN users ON user_to_group.user_id = users.email
          WHERE id = ?
    `,
    args: [id],
  });

  return {
    name: group.rows[0].name as string,
    iconIndex: group.rows[0].icon_index as number,
    users: group.rows.map((user) => ({
      displayName: user.display_name as string,
      role: user.role as string,
    })),
  };
}
