CREATE TABLE `normalized_song_cache`
(
    `song_key` text PRIMARY KEY NOT NULL,
    `data`     text
);
--> statement-breakpoint
ALTER TABLE bangers
    ADD `song_key` text DEFAULT '' NOT NULL;
