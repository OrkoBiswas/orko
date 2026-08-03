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

export function createProjectTemplate(displayOrder: number): ManagedProjectInput {
  const number = displayOrder + 1;
  return {
    id: `prj_custom_${crypto.randomUUID().replaceAll("-", "")}`,
    slug: `new-project-${number}`,
    title: "New Project",
    index: String(number).padStart(2, "0"),
    category: "Video Editing",
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
    status: "draft",
    displayOrder,
  };
}
