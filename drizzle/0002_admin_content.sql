CREATE TABLE `site_content` (
	`id` text PRIMARY KEY NOT NULL,
	`content_json` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_content` (
	`project_id` text PRIMARY KEY NOT NULL,
	`content_json` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
PRAGMA optimize;
