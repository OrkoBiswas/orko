import type { InquiryInput } from "@/lib/inquiry";
import type { Project } from "@/lib/portfolio";

type DatabaseEnv = { DB?: D1Database };

async function database() {
  const { env } = await import("cloudflare:workers");
  const db = (env as unknown as DatabaseEnv).DB;
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  return db;
}

let schemaReady: Promise<void> | null = null;

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
    ]);
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
