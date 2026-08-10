CREATE TABLE IF NOT EXISTS `portfolio_library_resets` (
	`id` text PRIMARY KEY NOT NULL,
	`applied_at` text NOT NULL
);
--> statement-breakpoint
DELETE FROM `project_content`
WHERE NOT EXISTS (
	SELECT 1 FROM `portfolio_library_resets` WHERE `id` = 'manual-reset-2026-08-10'
);
--> statement-breakpoint
DELETE FROM `projects`
WHERE NOT EXISTS (
	SELECT 1 FROM `portfolio_library_resets` WHERE `id` = 'manual-reset-2026-08-10'
);
--> statement-breakpoint
INSERT OR IGNORE INTO `portfolio_library_resets` (`id`, `applied_at`)
VALUES ('manual-reset-2026-08-10', '2026-08-10T00:00:00.000Z');
--> statement-breakpoint
PRAGMA optimize;
