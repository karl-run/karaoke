CREATE TABLE `dismissed_bangers` (
	`song_key` text NOT NULL,
	`user_id` text NOT NULL,
	`dismissed_at` integer NOT NULL,
	PRIMARY KEY(`song_key`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
