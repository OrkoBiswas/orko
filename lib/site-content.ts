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
  heroLineOne: "Visual stories,",
  heroLineTwo: "built to move.",
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
  workHeading: "Work worth stalking.",
  workIntro: "A growing library of edits, motion systems, campaigns, and visual experiments—built to be explored, not skimmed.",
  showreelHeading: "Seventy-two seconds of controlled energy.",
  showreelIntro: "The final reel will use licensed work only. Until then, the project library carries every frame honestly.",
  capabilitiesHeading: "One visual partner. More momentum.",
  capabilitiesIntro: "From the first story beat to the final export matrix, the work stays connected by one clear idea.",
  seoTitle: `${brand.name} — Video Editor, Motion Designer & Visual Storyteller`,
  seoDescription: brand.intro,
};

export function parseSiteContent(value: unknown): SiteContent {
  const candidate = typeof value === "object" && value ? { ...defaultSiteContent, ...value } : defaultSiteContent;
  const parsed = siteContentSchema.safeParse(candidate);
  return parsed.success ? parsed.data : defaultSiteContent;
}
