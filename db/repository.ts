import type { InquiryInput } from "@/lib/inquiry";
import { journalPosts, type JournalPost, type Project, type Service } from "@/lib/portfolio";
import { normalizeJournalPost, type ManagedJournalPostInput } from "@/lib/journal-content";
import { normalizeProject, type ManagedProjectInput } from "@/lib/project-content";
import { defaultSiteContent, parseSiteContent, type SiteContent } from "@/lib/site-content";
import type { CategoryThumbnail } from "@/lib/category-content";

type DatabaseEnv = { DB?: D1Database };

async function database() {
  const { env } = await import("cloudflare:workers");
  const db = (env as unknown as DatabaseEnv).DB;
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  return db;
}

let schemaReady: Promise<void> | null = null;

const legacySiteCopy: Partial<Record<keyof SiteContent, string>> = {
  title: "Video Editor · Motion Designer · Visual Storyteller",
  shortTitle: "Editor, motion artist & visual designer",
  headline: "Strong visuals, clear stories.",
  heroLineOne: "Strong visuals,",
  heroLineTwo: "clear stories.",
  intro: "I shape raw ideas into cinematic edits, precise motion systems, and campaign visuals people remember.",
  biography: "Orko Biswas is a multidisciplinary visual designer focused on the space where story, rhythm, and graphic clarity meet. From a single launch film to a complete social content system, every decision is made to give the message more momentum.",
  availability: "Booking select projects",
  responseTime: "Usually within 1–2 business days",
  workHeading: "Work worth stalking.",
  workIntro: "A growing library of edits, motion systems, campaigns, and visual experiments—built to be explored, not skimmed.",
  showreelHeading: "Seventy-two seconds of controlled energy.",
  showreelIntro: "The final reel will use licensed work only. Until then, the project library carries every frame honestly.",
  capabilitiesHeading: "One visual partner. More momentum.",
  capabilitiesIntro: "From the first story beat to the final export matrix, the work stays connected by one clear idea.",
  seoTitle: "Orko Biswas — Video Editor, Motion Designer & Visual Storyteller",
  seoDescription: "I shape raw ideas into cinematic edits, precise motion systems, and campaign visuals people remember.",
};

async function refreshLegacySiteCopy(db: D1Database) {
  const record = await db.prepare("SELECT content_json FROM site_content WHERE id = 'primary'").first<{ content_json: string }>();
  if (!record) return;
  try {
    const current = JSON.parse(record.content_json) as Record<string, unknown>;
    const next = { ...current };
    let changed = false;
    for (const [key, oldValue] of Object.entries(legacySiteCopy)) {
      if (current[key] === oldValue) {
        next[key] = defaultSiteContent[key as keyof SiteContent];
        changed = true;
      }
    }
    if (changed) {
      await db.prepare("UPDATE site_content SET content_json = ?, updated_at = ? WHERE id = 'primary'")
        .bind(JSON.stringify(next), new Date().toISOString())
        .run();
    }
  } catch {
    // Leave owner-managed content untouched if the saved JSON cannot be parsed.
  }
}

export function ensureSchema() {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    const db = await database();
    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        reference TEXT NOT NULL UNIQUE,
        pathway TEXT NOT NULL CHECK (pathway IN ('contact', 'brief')),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        country TEXT NOT NULL DEFAULT '',
        timezone TEXT NOT NULL DEFAULT '',
        communication TEXT NOT NULL DEFAULT '',
        project_type TEXT NOT NULL,
        goals TEXT NOT NULL DEFAULT '[]',
        deliverables TEXT NOT NULL DEFAULT '[]',
        materials TEXT NOT NULL DEFAULT '[]',
        style TEXT NOT NULL DEFAULT '[]',
        timeline TEXT NOT NULL,
        budget TEXT NOT NULL,
        details TEXT NOT NULL,
        consent_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        private_notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries(status, created_at)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'published',
        featured INTEGER NOT NULL DEFAULT 0,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_projects_status_order ON projects(status, display_order)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor_id TEXT NOT NULL,
        actor_email TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_audit_entity_created ON audit_logs(entity_type, entity_id, created_at)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0,
        window_started_at INTEGER NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS site_content (
        id TEXT PRIMARY KEY,
        content_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS project_content (
        project_id TEXT PRIMARY KEY,
        content_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS category_thumbnails (
        slug TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        media_url TEXT NOT NULL,
        media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
        media_alt TEXT NOT NULL,
        ratio TEXT NOT NULL DEFAULT 'wide' CHECK (ratio IN ('wide', 'tall', 'square', 'vertical', 'banner')),
        updated_at TEXT NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS service_content (
        service_slug TEXT PRIMARY KEY,
        content_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS journal_posts (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
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
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_journal_posts_status_published ON journal_posts(status, published_at)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_journal_posts_category_status ON journal_posts(category, status)"),
    ]);
    await refreshLegacySiteCopy(db);
    await db.prepare("PRAGMA optimize").run();
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}

export async function saveInquiry(input: InquiryInput, reference: string) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  await db
    .prepare(`INSERT INTO inquiries (
      id, reference, pathway, name, email, company, phone, country, timezone,
      communication, project_type, goals, deliverables, materials, style,
      timeline, budget, details, consent_at, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`)
    .bind(
      id,
      reference,
      input.pathway,
      input.name,
      input.email,
      input.company,
      input.phone,
      input.country,
      input.timezone,
      input.communication,
      input.projectType,
      JSON.stringify(input.goals),
      JSON.stringify(input.deliverables),
      JSON.stringify(input.materials),
      JSON.stringify(input.style),
      input.timeline,
      input.budget,
      input.details,
      now,
      now,
      now,
    )
    .run();
  return { id, reference, createdAt: now };
}

export type InquiryRecord = {
  id: string;
  reference: string;
  pathway: string;
  name: string;
  email: string;
  company: string;
  project_type: string;
  timeline: string;
  budget: string;
  details: string;
  status: string;
  created_at: string;
};

export async function listInquiries(limit = 100) {
  await ensureSchema();
  const result = await (await database())
    .prepare("SELECT id, reference, pathway, name, email, company, project_type, timeline, budget, details, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT ?")
    .bind(limit)
    .all<InquiryRecord>();
  return result.results ?? [];
}

export async function inquiryCounts() {
  await ensureSchema();
  const result = await (await database())
    .prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS unread FROM inquiries")
    .first<{ total: number; unread: number | null }>();
  return { total: result?.total ?? 0, unread: result?.unread ?? 0 };
}

export async function consumeRateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000) {
  await ensureSchema();
  const db = await database();
  const now = Date.now();
  const record = await db.prepare("SELECT count, window_started_at FROM rate_limits WHERE key = ?").bind(key).first<{ count: number; window_started_at: number }>();
  if (!record || now - record.window_started_at >= windowMs) {
    await db.prepare("INSERT INTO rate_limits (key, count, window_started_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, window_started_at = excluded.window_started_at").bind(key, now).run();
    return true;
  }
  if (record.count >= limit) return false;
  await db.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}

export async function seedProjects(items: Project[]) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const statements = items.map((project, index) =>
    db.prepare("INSERT OR IGNORE INTO projects (id, slug, title, status, featured, display_order, created_at, updated_at) VALUES (?, ?, ?, 'published', ?, ?, ?, ?)")
      .bind(project.id, project.slug, project.title, project.featured ? 1 : 0, index, now, now),
  );
  if (statements.length) await db.batch(statements);
}

export type ManagedProject = {
  id: string;
  slug: string;
  title: string;
  status: string;
  featured: number;
  display_order: number;
  updated_at: string;
};

export async function listManagedProjects() {
  await ensureSchema();
  const result = await (await database()).prepare("SELECT id, slug, title, status, featured, display_order, updated_at FROM projects ORDER BY display_order ASC").all<ManagedProject>();
  return result.results ?? [];
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    await ensureSchema();
    const record = await (await database()).prepare("SELECT content_json FROM site_content WHERE id = 'primary'").first<{ content_json: string }>();
    if (!record) return defaultSiteContent;
    return parseSiteContent(JSON.parse(record.content_json));
  } catch {
    return defaultSiteContent;
  }
}

export async function updateSiteContent(content: SiteContent, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("INSERT INTO site_content (id, content_json, updated_at) VALUES ('primary', ?, ?) ON CONFLICT(id) DO UPDATE SET content_json = excluded.content_json, updated_at = excluded.updated_at").bind(JSON.stringify(content), now),
    db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'site.content.updated', 'site', 'primary', ?)").bind(crypto.randomUUID(), actor.userId, actor.email, now),
  ]);
  return content;
}

type ProjectStateRecord = ManagedProject & { content_json: string | null };

function mergeProject(base: Project, record?: ProjectStateRecord): Project {
  let overrides: Partial<Project> = {};
  if (record?.content_json) {
    try { overrides = JSON.parse(record.content_json) as Partial<Project>; } catch { overrides = {}; }
  }
  const merged = {
    ...base,
    ...overrides,
    slug: record?.slug ?? base.slug,
    title: record?.title ?? base.title,
    featured: record ? Boolean(record.featured) : base.featured,
  };
  return normalizeProject(merged) ?? merged;
}

function customProject(record: ProjectStateRecord) {
  if (!record.content_json) return null;
  try {
    const parsed = normalizeProject(JSON.parse(record.content_json));
    return parsed ? { ...parsed, slug: record.slug, title: record.title, featured: Boolean(record.featured) } : null;
  } catch { return null; }
}

export async function listPortfolioProjects(defaults: Project[], options: { publishedOnly?: boolean } = {}) {
  try {
    await seedProjects(defaults);
    const rows = await (await database()).prepare(`SELECT p.id, p.slug, p.title, p.status, p.featured, p.display_order, p.updated_at, c.content_json
      FROM projects p LEFT JOIN project_content c ON c.project_id = p.id
      ${options.publishedOnly ? "WHERE p.status = 'published'" : "WHERE p.status != 'deleted'"}
      ORDER BY p.display_order ASC`).all<ProjectStateRecord>();
    const byId = new Map(defaults.map((project) => [project.id, project]));
    return (rows.results ?? []).flatMap((row) => {
      const base = byId.get(row.id);
      const project = base ? mergeProject(base, row) : customProject(row);
      return project ? [{ ...project, status: row.status, displayOrder: row.display_order }] : [];
    });
  } catch {
    return defaults.map((project, displayOrder) => ({ ...project, status: "published", displayOrder }));
  }
}

export async function getManagedProject(defaults: Project[], id: string) {
  const projects = await listPortfolioProjects(defaults);
  return projects.find((project) => project.id === id) ?? null;
}

type CategoryThumbnailRecord = {
  slug: string;
  label: string;
  media_url: string;
  media_type: "image" | "video";
  media_alt: string;
  ratio: CategoryThumbnail["ratio"];
  updated_at: string;
};

function mapCategoryThumbnail(record: CategoryThumbnailRecord): CategoryThumbnail {
  return {
    slug: record.slug,
    label: record.label,
    mediaUrl: record.media_url,
    mediaType: record.media_type,
    mediaAlt: record.media_alt,
    ratio: record.ratio,
    updatedAt: record.updated_at,
  };
}

export async function listCategoryThumbnails(): Promise<CategoryThumbnail[]> {
  try {
    await ensureSchema();
    const rows = await (await database()).prepare("SELECT slug, label, media_url, media_type, media_alt, ratio, updated_at FROM category_thumbnails ORDER BY label ASC").all<CategoryThumbnailRecord>();
    return (rows.results ?? []).map(mapCategoryThumbnail);
  } catch {
    return [];
  }
}

export async function updateCategoryThumbnail(
  slug: string,
  input: Omit<CategoryThumbnail, "slug" | "updatedAt">,
  actor: { userId: string; email: string },
) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("INSERT INTO category_thumbnails (slug, label, media_url, media_type, media_alt, ratio, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET label = excluded.label, media_url = excluded.media_url, media_type = excluded.media_type, media_alt = excluded.media_alt, ratio = excluded.ratio, updated_at = excluded.updated_at")
      .bind(slug, input.label, input.mediaUrl, input.mediaType, input.mediaAlt, input.ratio, now),
    db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'category.thumbnail.updated', 'category', ?, ?)")
      .bind(crypto.randomUUID(), actor.userId, actor.email, slug, now),
  ]);
  return { ...input, slug, updatedAt: now } satisfies CategoryThumbnail;
}

export async function deleteCategoryThumbnail(slug: string, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const result = await db.prepare("DELETE FROM category_thumbnails WHERE slug = ?").bind(slug).run();
  if (!result.meta.changes) return false;
  await db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'category.thumbnail.removed', 'category', ?, ?)")
    .bind(crypto.randomUUID(), actor.userId, actor.email, slug, new Date().toISOString())
    .run();
  return true;
}

export async function updateManagedProject(
  id: string,
  input: Partial<Project> & { status: string; displayOrder: number },
  actor: { userId: string; email: string },
) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const { status, displayOrder, ...content } = input;
  const result = await db.prepare("UPDATE projects SET slug = ?, title = ?, status = ?, featured = ?, display_order = ?, updated_at = ? WHERE id = ?")
    .bind(content.slug, content.title, status, content.featured ? 1 : 0, displayOrder, now, id).run();
  if (!result.meta.changes) return false;
  await db.batch([
    db.prepare("INSERT INTO project_content (project_id, content_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(project_id) DO UPDATE SET content_json = excluded.content_json, updated_at = excluded.updated_at").bind(id, JSON.stringify(content), now),
    db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'project.content.updated', 'project', ?, ?)").bind(crypto.randomUUID(), actor.userId, actor.email, id, now),
  ]);
  return true;
}

export async function createManagedProject(input: ManagedProjectInput, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const duplicate = await db.prepare("SELECT id FROM projects WHERE id = ? OR slug = ? LIMIT 1").bind(input.id, input.slug).first<{ id: string }>();
  if (duplicate) return false;
  const { status, displayOrder, ...content } = input;
  await db.batch([
    db.prepare("INSERT INTO projects (id, slug, title, status, featured, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(input.id, input.slug, input.title, status, input.featured ? 1 : 0, displayOrder, now, now),
    db.prepare("INSERT INTO project_content (project_id, content_json, updated_at) VALUES (?, ?, ?)").bind(input.id, JSON.stringify(content), now),
    db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'project.created', 'project', ?, ?)").bind(crypto.randomUUID(), actor.userId, actor.email, input.id, now),
  ]);
  return true;
}

export async function deleteManagedProject(id: string, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const result = await db.prepare("UPDATE projects SET status = 'deleted', updated_at = ? WHERE id = ? AND status != 'deleted'").bind(now, id).run();
  if (!result.meta.changes) return false;
  await db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'project.deleted', 'project', ?, ?)")
    .bind(crypto.randomUUID(), actor.userId, actor.email, id, now)
    .run();
  return true;
}

export async function listPortfolioServices(defaults: Service[]) {
  try {
    await ensureSchema();
    const rows = await (await database()).prepare("SELECT service_slug, content_json FROM service_content").all<{ service_slug: string; content_json: string }>();
    const overrides = new Map((rows.results ?? []).map((row) => [row.service_slug, row.content_json]));
    return defaults.map((service) => {
      const raw = overrides.get(service.slug);
      if (!raw) return service;
      try { return { ...service, ...(JSON.parse(raw) as Partial<Service>) }; } catch { return service; }
    }).sort((left, right) => left.number.localeCompare(right.number));
  } catch {
    return defaults;
  }
}

export async function getManagedService(defaults: Service[], slug: string) {
  return (await listPortfolioServices(defaults)).find((service) => service.slug === slug) ?? null;
}

export async function updateManagedService(originalSlug: string, service: Service, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("INSERT INTO service_content (service_slug, content_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(service_slug) DO UPDATE SET content_json = excluded.content_json, updated_at = excluded.updated_at").bind(originalSlug, JSON.stringify(service), now),
    db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'service.content.updated', 'service', ?, ?)").bind(crypto.randomUUID(), actor.userId, actor.email, originalSlug, now),
  ]);
  return true;
}

export async function updateProjectStatus(id: string, status: string, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const result = await db.prepare("UPDATE projects SET status = ?, updated_at = ? WHERE id = ?").bind(status, now, id).run();
  if (!result.meta.changes) return false;
  await db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'project.status.updated', 'project', ?, ?)")
    .bind(crypto.randomUUID(), actor.userId, actor.email, id, now)
    .run();
  return true;
}

export async function updateInquiryStatus(id: string, status: string, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const result = await db.prepare("UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?").bind(status, now, id).run();
  if (!result.meta.changes) return false;
  await db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'inquiry.status.updated', 'inquiry', ?, ?)")
    .bind(crypto.randomUUID(), actor.userId, actor.email, id, now)
    .run();
  return true;
}

export type ManagedJournalPost = JournalPost & {
  status: "draft" | "published" | "archived" | "deleted";
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

type JournalPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: JournalPost["category"];
  status: ManagedJournalPost["status"];
  featured: number;
  display_order: number;
  cover_url: string;
  cover_alt: string;
  tags_json: string;
  files_json: string;
  reading_minutes: number;
  published_at: string;
  created_at: string;
  updated_at: string;
};

function parseJournalRecord(record: JournalPostRecord): ManagedJournalPost | null {
  try {
    const post = normalizeJournalPost({
      id: record.id,
      slug: record.slug,
      title: record.title,
      excerpt: record.excerpt,
      body: record.body,
      category: record.category,
      tags: JSON.parse(record.tags_json),
      coverUrl: record.cover_url,
      coverAlt: record.cover_alt,
      readingMinutes: record.reading_minutes,
      publishedAt: record.published_at,
      files: JSON.parse(record.files_json),
    });
    if (!post) return null;
    return {
      ...post,
      status: record.status,
      featured: Boolean(record.featured),
      displayOrder: record.display_order,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  } catch {
    return null;
  }
}

function defaultManagedJournalPosts(): ManagedJournalPost[] {
  const now = new Date().toISOString();
  return journalPosts.map((post, displayOrder) => ({ ...post, status: "published" as const, featured: displayOrder === 0, displayOrder, createdAt: post.publishedAt || now, updatedAt: post.publishedAt || now }));
}

async function seedJournalPosts() {
  await ensureSchema();
  const db = await database();
  const statements = journalPosts.map((post, displayOrder) => db.prepare(
    "INSERT OR IGNORE INTO journal_posts (id, slug, title, excerpt, body, category, status, featured, display_order, cover_url, cover_alt, tags_json, files_json, reading_minutes, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(
    post.id,
    post.slug,
    post.title,
    post.excerpt,
    post.body,
    post.category,
    displayOrder === 0 ? 1 : 0,
    displayOrder,
    post.coverUrl,
    post.coverAlt,
    JSON.stringify(post.tags),
    JSON.stringify(post.files),
    post.readingMinutes,
    post.publishedAt,
    post.publishedAt,
    post.publishedAt,
  ));
  if (statements.length) await db.batch(statements);
}

export async function listJournalPosts(options: { publishedOnly?: boolean; category?: JournalPost["category"]; limit?: number } = {}) {
  try {
    await seedJournalPosts();
    const db = await database();
    const constraints = ["status != 'deleted'"];
    const values: Array<string | number> = [];
    if (options.publishedOnly) {
      constraints.push("status = 'published'", "published_at <= ?");
      values.push(new Date().toISOString());
    }
    if (options.category) {
      constraints.push("category = ?");
      values.push(options.category);
    }
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 100);
    values.push(limit);
    const rows = await db.prepare(`SELECT id, slug, title, excerpt, body, category, status, featured, display_order, cover_url, cover_alt, tags_json, files_json, reading_minutes, published_at, created_at, updated_at FROM journal_posts WHERE ${constraints.join(" AND ")} ORDER BY featured DESC, display_order ASC, published_at DESC LIMIT ?`).bind(...values).all<JournalPostRecord>();
    return (rows.results ?? []).flatMap((record) => {
      const post = parseJournalRecord(record);
      return post ? [post] : [];
    });
  } catch {
    return defaultManagedJournalPosts().filter((post) => !options.category || post.category === options.category).slice(0, options.limit ?? 100);
  }
}

export async function getJournalPostBySlug(slug: string, options: { publishedOnly?: boolean } = {}) {
  const posts = await listJournalPosts({ publishedOnly: options.publishedOnly, limit: 100 });
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getManagedJournalPost(id: string) {
  const posts = await listJournalPosts({ limit: 100 });
  return posts.find((post) => post.id === id) ?? null;
}

export async function createManagedJournalPost(input: ManagedJournalPostInput, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const duplicate = await db.prepare("SELECT id FROM journal_posts WHERE id = ? OR slug = ? LIMIT 1").bind(input.id, input.slug).first<{ id: string }>();
  if (duplicate) return false;
  await db.batch([
    db.prepare("INSERT INTO journal_posts (id, slug, title, excerpt, body, category, status, featured, display_order, cover_url, cover_alt, tags_json, files_json, reading_minutes, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(input.id, input.slug, input.title, input.excerpt, input.body, input.category, input.status, input.featured ? 1 : 0, input.displayOrder, input.coverUrl, input.coverAlt, JSON.stringify(input.tags), JSON.stringify(input.files), input.readingMinutes, input.publishedAt, now, now),
    db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'journal.post.created', 'journal', ?, ?)")
      .bind(crypto.randomUUID(), actor.userId, actor.email, input.id, now),
  ]);
  return true;
}

export async function updateManagedJournalPost(id: string, input: ManagedJournalPostInput, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const duplicate = await db.prepare("SELECT id FROM journal_posts WHERE slug = ? AND id != ? LIMIT 1").bind(input.slug, id).first<{ id: string }>();
  if (duplicate) return false;
  const result = await db.prepare("UPDATE journal_posts SET slug = ?, title = ?, excerpt = ?, body = ?, category = ?, status = ?, featured = ?, display_order = ?, cover_url = ?, cover_alt = ?, tags_json = ?, files_json = ?, reading_minutes = ?, published_at = ?, updated_at = ? WHERE id = ? AND status != 'deleted'")
    .bind(input.slug, input.title, input.excerpt, input.body, input.category, input.status, input.featured ? 1 : 0, input.displayOrder, input.coverUrl, input.coverAlt, JSON.stringify(input.tags), JSON.stringify(input.files), input.readingMinutes, input.publishedAt, now, id).run();
  if (!result.meta.changes) return null;
  await db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'journal.post.updated', 'journal', ?, ?)")
    .bind(crypto.randomUUID(), actor.userId, actor.email, id, now).run();
  return true;
}

export async function deleteManagedJournalPost(id: string, actor: { userId: string; email: string }) {
  await ensureSchema();
  const db = await database();
  const now = new Date().toISOString();
  const result = await db.prepare("UPDATE journal_posts SET status = 'deleted', updated_at = ? WHERE id = ? AND status != 'deleted'").bind(now, id).run();
  if (!result.meta.changes) return false;
  await db.prepare("INSERT INTO audit_logs (id, actor_id, actor_email, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, 'journal.post.deleted', 'journal', ?, ?)")
    .bind(crypto.randomUUID(), actor.userId, actor.email, id, now).run();
  return true;
}

export async function journalCounts() {
  try {
    await seedJournalPosts();
    const record = await (await database()).prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published, SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts FROM journal_posts WHERE status != 'deleted'").first<{ total: number; published: number | null; drafts: number | null }>();
    return { total: record?.total ?? 0, published: record?.published ?? 0, drafts: record?.drafts ?? 0 };
  } catch {
    return { total: journalPosts.length, published: journalPosts.length, drafts: 0 };
  }
}
