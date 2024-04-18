/**
 * Script used to do one-off stuff when developing
 */
import { sql } from 'drizzle-orm';

import { db } from '../src/server/db';

const result = await db.all(sql`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table';
`);

console.log(result);
