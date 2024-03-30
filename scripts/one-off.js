import { client } from '@/db/client.ts';

/**
 * Script used to do one-off stuff when developing
 */

const result = await client.execute(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table';
`);

console.log(result);
