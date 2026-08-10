CREATE TABLE `category_thumbnails` (
	`slug` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`media_url` text NOT NULL,
	`media_type` text NOT NULL CHECK (`media_type` IN ('image', 'video')),
	`media_alt` text NOT NULL,
	`ratio` text DEFAULT 'wide' NOT NULL CHECK (`ratio` IN ('wide', 'tall', 'square', 'vertical', 'banner')),
	`updated_at` text NOT NULL
);
--> statement-breakpoint
PRAGMA optimize;
