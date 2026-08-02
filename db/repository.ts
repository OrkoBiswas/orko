import type { InquiryInput } from "@/lib/inquiry";
import type { Project, Service } from "@/lib/portfolio";
import { defaultSiteContent, parseSiteContent, type SiteContent } from "@/lib/site-content";

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
  headline: "Visual stories, built to move.",
  heroLineOne: "Visual stories,",
  heroLineTwo: "built to move.",
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
      db.prepare(`CREATE TABLE IF NOT EXISTS service_content (
        service_slug TEXT PRIMARY KEY,
        content_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
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
  return {
    ...base,
    ...overrides,
    slug: record?.slug ?? base.slug,
    title: record?.title ?? base.title,
    featured: record ? Boolean(record.featured) : base.featured,
  };
}

export async function listPortfolioProjects(defaults: Project[], options: { publishedOnly?: boolean } = {}) {
  try {
    await seedProjects(defaults);
    const rows = await (await database()).prepare(`SELECT p.id, p.slug, p.title, p.status, p.featured, p.display_order, p.updated_at, c.content_json
      FROM projects p LEFT JOIN project_content c ON c.project_id = p.id
      ${options.publishedOnly ? "WHERE p.status = 'published'" : ""}
      ORDER BY p.display_order ASC`).all<ProjectStateRecord>();
    const byId = new Map(defaults.map((project) => [project.id, project]));
    return (rows.results ?? []).flatMap((row) => {
      const base = byId.get(row.id);
      return base ? [{ ...mergeProject(base, row), status: row.status, displayOrder: row.display_order }] : [];
    });
  } catch {
    return defaults.map((project, displayOrder) => ({ ...project, status: "published", displayOrder }));
  }
}

export async function getManagedProject(defaults: Project[], id: string) {
  const projects = await listPortfolioProjects(defaults);
  return projects.find((project) => project.id === id) ?? null;
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
