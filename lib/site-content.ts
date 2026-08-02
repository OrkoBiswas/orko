import { z } from "zod";
import { brand } from "@/lib/brand";

const textField = z.string().trim().min(1).max(500);
const longTextField = z.string().trim().min(1).max(3000);
const optionalUrl = z.string().trim().max(500).refine((value) => !value || /^https?:\/\//i.test(value), "Enter a complete http(s) URL.");

export const siteContentSchema = z.object({
  name: textField.max(80),
  monogram: textField.max(6),
  title: textField.max(160),
  shortTitle: textField.max(160),
  headline: textField.max(160),
  heroLineOne: textField.max(90),
  heroLineTwo: textField.max(90),
  intro: longTextField.max(700),
  biography: longTextField,
  location: textField.max(160),
  timezone: textField.max(60),
  availability: textField.max(120),
  responseTime: textField.max(120),
  primaryCta: textField.max(80),
  secondaryCta: textField.max(80),
  email: z.string().trim().email().max(200),
  instagram: optionalUrl,
  linkedin: optionalUrl,
  behance: optionalUrl,
  workHeading: textField.max(180),
  workIntro: longTextField.max(800),
  showreelHeading: textField.max(180),
  showreelIntro: longTextField.max(800),
  capabilitiesHeading: textField.max(180),
  capabilitiesIntro: longTextField.max(800),
  seoTitle: textField.max(120),
  seoDescription: longTextField.max(320),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultSiteContent: SiteContent = {
  name: brand.name,
  monogram: brand.monogram,
  title: brand.title,
  shortTitle: brand.shortTitle,
  headline: brand.headline,
  heroLineOne: "Strong visuals,",
  heroLineTwo: "clear stories.",
  intro: brand.intro,
  biography: brand.biography,
  location: brand.location,
  timezone: brand.timezone,
  availability: brand.availability,
  responseTime: brand.responseTime,
  primaryCta: brand.primaryCta,
  secondaryCta: brand.secondaryCta,
  email: brand.email,
  instagram: brand.social.instagram,
  linkedin: brand.social.linkedin,
  behance: brand.social.behance,
  workHeading: "Selected creative work.",
  workIntro: "Explore video edits, motion graphics, posters, social content, brand visuals, and project bundles.",
  showreelHeading: "A quick look at my work.",
  showreelIntro: "The final reel will show licensed projects only. You can explore the work library while it is being prepared.",
  capabilitiesHeading: "Video, motion, and design.",
  capabilitiesIntro: "I can support one focused task or build a complete set of visuals for your campaign.",
  seoTitle: `${brand.name} — Video Editor, Motion Designer & Graphic Designer`,
  seoDescription: brand.intro,
};

export function parseSiteContent(value: unknown): SiteContent {
  const candidate = typeof value === "object" && value ? { ...defaultSiteContent, ...value } : defaultSiteContent;
  const parsed = siteContentSchema.safeParse(candidate);
  return parsed.success ? parsed.data : defaultSiteContent;
}
