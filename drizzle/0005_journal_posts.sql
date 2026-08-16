CREATE TABLE IF NOT EXISTS journal_posts (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('creative-news', 'tips-tricks', 'build-notes')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  featured INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  cover_url TEXT NOT NULL DEFAULT '',
  cover_alt TEXT NOT NULL DEFAULT '',
  tags_json TEXT NOT NULL DEFAULT '[]',
  files_json TEXT NOT NULL DEFAULT '[]',
  reading_minutes INTEGER NOT NULL DEFAULT 3,
  published_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_posts_slug ON journal_posts (slug);
CREATE INDEX IF NOT EXISTS idx_journal_posts_status_published ON journal_posts (status, published_at);
CREATE INDEX IF NOT EXISTS idx_journal_posts_category_status ON journal_posts (category, status);
