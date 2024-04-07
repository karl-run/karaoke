CREATE TABLE `bangers` (
	`song_id` text,
	`user_id` text,
	PRIMARY KEY(`song_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`created_at` integer NOT NULL,
	`last_seen` integer NOT NULL,
	`ua` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `song_cache` (
	`song_id` text PRIMARY KEY NOT NULL,
	`data` text
);
--> statement-breakpoint
CREATE TABLE `user_group` (
	`id` text PRIMARY KEY NOT NULL,
	`join_key` text NOT NULL,
	`icon_index` integer NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `user_to_group` (
	`user_id` text,
	`group_id` text,
	`role` text DEFAULT 'member',
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `user_group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text PRIMARY KEY NOT NULL,
	`safeId` text NOT NULL,
	`name` text NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`login_hash` text,
	`login_salt` text,
	`login_timestamp` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_group_join_key_unique` ON `user_group` (`join_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_safeId_unique` ON `users` (`safeId`);