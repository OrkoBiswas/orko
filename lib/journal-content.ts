import { z } from "zod";
import type { JournalPost } from "@/lib/portfolio";

const secureUrl = z.string().trim().min(1).max(1000).refine((value) => /^https:\/\//i.test(value), "Use a secure https URL.");
const optionalSecureUrl = z.string().trim().max(1000).refine((value) => !value || /^https:\/\//i.test(value), "Use a secure https URL.");

const downloadSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500),
  url: secureUrl,
  format: z.string().trim().min(1).max(40),
}).strict();

export const journalPostSchema = z.object({
  id: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(180),
  excerpt: z.string().trim().min(1).max(600),
  body: z.string().trim().min(1).max(12_000),
  category: z.enum(["creative-news", "tips-tricks", "build-notes"]),
  tags: z.array(z.string().trim().min(1).max(60)).max(12),
  coverUrl: optionalSecureUrl.default(""),
  coverAlt: z.string().trim().max(300).default(""),
  readingMinutes: z.number().int().min(1).max(60),
  publishedAt: z.string().datetime(),
  files: z.array(downloadSchema).max(20).default([]),
});

export const managedJournalPostSchema = journalPostSchema.extend({
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0).max(999),
});

export type ManagedJournalPostInput = z.infer<typeof managedJournalPostSchema>;

export function normalizeJournalPost(value: unknown): JournalPost | null {
  const parsed = journalPostSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function createJournalPostTemplate(displayOrder: number): ManagedJournalPostInput {
  const now = new Date().toISOString();
  return {
    id: `journal_${crypto.randomUUID().replaceAll("-", "")}`,
    slug: `new-studio-note-${displayOrder + 1}`,
    title: "New studio note",
    excerpt: "Add a concise introduction that makes the post useful at a glance.",
    body: "Write the full story, tutorial, release note, or development update here.",
    category: "creative-news",
    tags: ["Studio note"],
    coverUrl: "",
    coverAlt: "",
    readingMinutes: 3,
    publishedAt: now,
    files: [],
    status: "draft",
    featured: false,
    displayOrder,
  };
}
