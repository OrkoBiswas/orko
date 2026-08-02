import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull(),
    pathway: text("pathway", { enum: ["contact", "brief"] }).notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company").notNull().default(""),
    phone: text("phone").notNull().default(""),
    country: text("country").notNull().default(""),
    timezone: text("timezone").notNull().default(""),
    communication: text("communication").notNull().default(""),
    projectType: text("project_type").notNull(),
    goals: text("goals").notNull().default("[]"),
    deliverables: text("deliverables").notNull().default("[]"),
    materials: text("materials").notNull().default("[]"),
    style: text("style").notNull().default("[]"),
    timeline: text("timeline").notNull(),
    budget: text("budget").notNull(),
    details: text("details").notNull(),
    consentAt: text("consent_at").notNull(),
    status: text("status").notNull().default("new"),
    privateNotes: text("private_notes").notNull().default(""),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_inquiries_reference").on(table.reference),
    index("idx_inquiries_status_created").on(table.status, table.createdAt),
  ],
);

export const managedProjects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    status: text("status").notNull().default("published"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_projects_slug").on(table.slug),
    index("idx_projects_status_order").on(table.status, table.displayOrder),
  ],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id").notNull(),
    actorEmail: text("actor_email").notNull(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("idx_audit_entity_created").on(table.entityType, table.entityId, table.createdAt)],
);

export const rateLimits = sqliteTable(
  "rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(0),
    windowStartedAt: integer("window_started_at").notNull(),
  },
);

export const siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  contentJson: text("content_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const projectContent = sqliteTable("project_content", {
  projectId: text("project_id").primaryKey(),
  contentJson: text("content_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const serviceContent = sqliteTable("service_content", {
  serviceSlug: text("service_slug").primaryKey(),
  contentJson: text("content_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});
