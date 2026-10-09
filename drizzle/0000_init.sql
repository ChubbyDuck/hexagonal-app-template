CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL,
	`archived_at` integer
);
