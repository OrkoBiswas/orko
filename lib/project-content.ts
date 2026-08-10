import { z } from "zod";
import type { Project } from "@/lib/portfolio";

const optionalMediaUrl = z.string().trim().max(1000).refine((value) => !value || /^https:\/\//i.test(value), "Use a secure https URL.");
const galleryMediaSchema = z.object({
  id: z.string().trim().min(1).max(120),
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1).max(1000).refine((value) => /^https:\/\//i.test(value), "Use a secure https URL."),
  alt: z.string().trim().max(300),
  title: z.string().trim().max(160).default(""),
  category: z.string().trim().max(100).default(""),
  client: z.string().trim().max(160).default(""),
  industry: z.string().trim().max(100).default(""),
  year: z.number().int().min(2000).max(2100).nullable().default(null),
}).strict();

const blockId = z.string().trim().min(1).max(120);
const secureUrl = z.string().trim().min(1).max(1000).refine((value) => /^https:\/\//i.test(value), "Use a secure https URL.");
const optionalSecureUrl = z.string().trim().max(1000).refine((value) => !value || /^https:\/\//i.test(value), "Use a secure https URL.");
const blockWidth = z.enum(["compact", "standard", "wide", "full"]);
const textWidth = z.enum(["compact", "standard", "wide"]);
const blockMediaSchema = z.object({ id: blockId, url: secureUrl, alt: z.string().trim().max(300) }).strict();
const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ id: blockId, type: z.literal("image"), width: blockWidth, url: optionalSecureUrl, alt: z.string().trim().max(300), caption: z.string().trim().max(500) }).strict(),
  z.object({ id: blockId, type: z.literal("text"), width: textWidth, style: z.enum(["heading", "body", "quote"]), align: z.enum(["left", "center"]), heading: z.string().trim().max(300), body: z.string().trim().max(5000) }).strict(),
  z.object({ id: blockId, type: z.literal("photo-grid"), width: blockWidth, columns: z.union([z.literal(2), z.literal(3)]), gap: z.enum(["none", "small", "medium"]), items: z.array(blockMediaSchema).max(12) }).strict(),
  z.object({ id: blockId, type: z.literal("video-audio"), width: blockWidth, mediaType: z.enum(["video", "audio"]), url: optionalSecureUrl, posterUrl: optionalSecureUrl, alt: z.string().trim().max(300), caption: z.string().trim().max(500) }).strict(),
  z.object({ id: blockId, type: z.literal("embed"), width: blockWidth, url: optionalSecureUrl, title: z.string().trim().max(200), caption: z.string().trim().max(500) }).strict(),
  z.object({ id: blockId, type: z.literal("lightroom"), width: blockWidth, beforeUrl: optionalSecureUrl, afterUrl: optionalSecureUrl, alt: z.string().trim().max(300), caption: z.string().trim().max(500) }).strict(),
  z.object({ id: blockId, type: z.literal("prototype"), width: blockWidth, url: optionalSecureUrl, title: z.string().trim().max(200), description: z.string().trim().max(1000) }).strict(),
  z.object({ id: blockId, type: z.literal("3d"), width: blockWidth, url: optionalSecureUrl, title: z.string().trim().max(200), description: z.string().trim().max(1000) }).strict(),
  z.object({ id: blockId, type: z.literal("divider"), width: textWidth, size: z.enum(["small", "medium", "large"]) }).strict(),
]);

const presentationSchema = z.object({
  background: z.string().regex(/^#[0-9a-f]{6}$/i),
  textColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  contentWidth: z.enum(["standard", "wide", "full"]),
  spacing: z.enum(["compact", "balanced", "airy"]),
}).strict();

const customCtaSchema = z.object({
  enabled: z.boolean(),
  label: z.string().trim().max(100),
  url: optionalSecureUrl,
}).strict();

const assetSchema = z.object({
  id: blockId,
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500),
  url: secureUrl,
}).strict();

export const projectContentSchema = z.object({
  id: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  index: z.string().trim().min(1).max(10),
  category: z.string().trim().min(1).max(100),
  services: z.array(z.string().trim().min(1).max(100)).min(1).max(20),
  industry: z.string().trim().min(1).max(100),
  client: z.string().trim().min(1).max(160),
  year: z.number().int().min(2000).max(2100),
  featured: z.boolean(),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  visual: z.enum(["orbit", "signal", "editorial", "spectrum", "type", "frame"]),
  ratio: z.enum(["wide", "tall", "square", "vertical", "banner"]),
  summary: z.string().trim().min(1).max(1000),
  challenge: z.string().trim().min(1).max(2000),
  concept: z.string().trim().min(1).max(2000),
  approach: z.array(z.string().trim().min(1).max(300)).min(1).max(20),
  deliverables: z.array(z.string().trim().min(1).max(300)).min(1).max(30),
  tools: z.array(z.string().trim().min(1).max(100)).min(1).max(30),
  mediaUrl: optionalMediaUrl.default(""),
  mediaType: z.enum(["generated", "image", "video"]).default("generated"),
  mediaAlt: z.string().trim().max(300).default(""),
  gallery: z.array(galleryMediaSchema).max(24).default([]),
  contentBlocks: z.array(contentBlockSchema).max(60).default([]),
  presentation: presentationSchema.default({ background: "#f4f2ea", textColor: "#171a16", contentWidth: "wide", spacing: "balanced" }),
  customCta: customCtaSchema.default({ enabled: false, label: "Visit project", url: "" }),
  assets: z.array(assetSchema).max(20).default([]),
});

export const managedProjectSchema = projectContentSchema.extend({
  status: z.enum(["draft", "published", "archived"]),
  displayOrder: z.number().int().min(0).max(999),
});

export type ManagedProjectInput = z.infer<typeof managedProjectSchema>;

export function normalizeProject(value: unknown): Project | null {
  const parsed = projectContentSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function createProjectTemplate(displayOrder: number, category = ""): ManagedProjectInput {
  const number = displayOrder + 1;
  return {
    id: `prj_custom_${crypto.randomUUID().replaceAll("-", "")}`,
    slug: `new-project-${number}`,
    title: "New Project",
    index: String(number).padStart(2, "0"),
    category,
    services: ["Video Editing"],
    industry: "Creative",
    client: "Portfolio Project",
    year: new Date().getFullYear(),
    featured: false,
    accent: "#c9ff43",
    visual: "frame",
    ratio: "wide",
    summary: "Add a short and clear overview of this work.",
    challenge: "Explain the main goal or problem behind this project.",
    concept: "Explain the creative idea and visual direction.",
    approach: ["Planning", "Creative development", "Review", "Delivery"],
    deliverables: ["Final project files"],
    tools: ["Premiere Pro"],
    mediaUrl: "",
    mediaType: "generated",
    mediaAlt: "",
    gallery: [],
    contentBlocks: [],
    presentation: { background: "#f4f2ea", textColor: "#171a16", contentWidth: "wide", spacing: "balanced" },
    customCta: { enabled: false, label: "Visit project", url: "" },
    assets: [],
    status: "draft",
    displayOrder,
  };
}
