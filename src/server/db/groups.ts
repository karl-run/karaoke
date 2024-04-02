import { client } from '@/server/db/client';
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
        SELECT user_group.*,
               (SELECT COUNT(*)
                FROM user_to_group AS utg2
                WHERE utg2.group_id = user_group.id) AS member_count
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
    memberCount: group.member_count as number,
  }));
}

export async function getGroup(id: string) {
  const group = await client.execute({
    sql: `SELECT users.name as display_name, users.email, user_to_group.role, user_group.name, user_group.icon_index, user_group.join_key
          FROM user_group
                 LEFT JOIN user_to_group ON user_group.id = user_to_group.group_id
                 LEFT JOIN users ON user_to_group.user_id = users.email
          WHERE id = ?
    `,
    args: [id],
  });

  if (group.rows.length === 0) {
    return null;
  }

  return {
    name: group.rows[0].name as string,
    iconIndex: group.rows[0].icon_index as number,
    joinCode: group.rows[0].join_key as string,
    users: group.rows.map((user) => ({
      displayName: user.display_name as string,
      role: user.role as string,
      userId: user.email as string,
    })),
  };
}

export async function getGroupByJoinCode(code: string) {
  const group = await client.execute({
    sql: `
      SELECT * FROM user_group
      WHERE join_key = ?
    `,
    args: [code],
  });

  if (group.rows.length === 0) {
    return null;
  }

  return {
    name: group.rows[0].name as string,
    iconIndex: group.rows[0].icon_index as number,
  };
}

export async function joinGroup(code: string, userId: string) {
  const group = await getGroupByJoinCode(code);

  if (!group) {
    return null;
  }

  const result = await client.execute({
    sql: `
        INSERT INTO user_to_group (user_id, group_id)
        SELECT ?, id
        FROM user_group
        WHERE join_key = ?
        RETURNING group_id
      `,
    args: [userId, code],
  });

  return {
    id: result.rows[0].group_id as string,
  };
}

export async function isUserInGroup(userId: string, code: string) {
  const result = await client.execute({
    sql: `
      SELECT *
      FROM user_to_group
             JOIN user_group ON user_to_group.group_id = user_group.id
      WHERE user_to_group.user_id = ?
        AND user_group.join_key = ?
    `,
    args: [userId, code],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return {
    id: result.rows[0].group_id as string,
  };
}

export async function deleteGroup(groupId: string) {
  const transaction = await client.transaction('write');
  await client.execute({
    sql: `
        DELETE FROM user_to_group
        WHERE group_id = ?
        `,
    args: [groupId],
  });
  await client.execute({
    sql: `
      DELETE FROM user_group
      WHERE id = ?
    `,
    args: [groupId],
  });
  await transaction.commit();
}
