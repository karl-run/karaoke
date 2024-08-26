/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/

ALTER TABLE `users` ADD `joined_at_new` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
UPDATE `users` SET `joined_at_new` = `joined_at`;
--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `joined_at`;
--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `joined_at_new` TO `joined_at`;
