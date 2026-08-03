import { z } from "zod";
import { brand } from "@/lib/brand";

const textField = z.string().trim().min(1).max(500);
const longTextField = z.string().trim().min(1).max(3000);
const optionalTextField = z.string().trim().max(500);
const optionalUrl = z.string().trim().max(500).refine((value) => !value || /^https?:\/\//i.test(value), "Enter a complete http(s) URL.");
const optionalAssetUrl = z.string().trim().max(500).refine((value) => !value || /^https:\/\/res\.cloudinary\.com\//i.test(value) || /^\/[a-z0-9/_.,?=&%-]+$/i.test(value), "Use a secure Cloudinary URL or root-relative asset path.");

const profileLinkSchema = z.object({
  id: textField.max(120),
  platform: z.enum(["fiverr", "dribbble", "behance", "discord", "linkedin", "instagram", "youtube", "custom"]),
  label: textField.max(80),
  url: optionalUrl.refine(Boolean, "Enter a complete profile or service URL."),
  enabled: z.boolean().default(true),
  featured: z.boolean().default(false),
});

const experienceSchema = z.object({
  id: textField.max(120),
  organization: textField.max(180),
  role: textField.max(180),
  period: textField.max(120),
  location: textField.max(180),
  summary: longTextField.max(900),
});

const testimonialSchema = z.object({
  id: textField.max(120),
  quote: longTextField.max(900),
  name: textField.max(160),
  role: optionalTextField.max(160),
  company: optionalTextField.max(180),
  mediaType: z.enum(["none", "image", "video"]).default("none"),
  mediaUrl: optionalUrl.default(""),
  mediaAlt: optionalTextField.max(300).default(""),
});

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
  logoUrl: optionalAssetUrl.default(""),
  logoAlt: optionalTextField.max(160).default(""),
  faviconUrl: optionalAssetUrl.default(""),
  socialImageUrl: optionalAssetUrl.default(""),
  profileLinksHeading: textField.max(120).default("Find me and hire me online."),
  profileLinks: z.array(profileLinkSchema).max(10).default([]),
  workHeading: textField.max(180),
  workIntro: longTextField.max(800),
  showreelHeading: textField.max(180),
  showreelIntro: longTextField.max(800),
  capabilitiesHeading: textField.max(180),
  capabilitiesIntro: longTextField.max(800),
  experienceHeading: textField.max(180),
  experienceIntro: longTextField.max(800),
  experiences: z.array(experienceSchema).max(8),
  testimonialsHeading: textField.max(180),
  testimonialsIntro: longTextField.max(800),
  testimonials: z.array(testimonialSchema).max(8),
  seoTitle: textField.max(120),
  seoDescription: longTextField.max(320),
  seoKeywords: optionalTextField.max(500).default(""),
  canonicalUrl: optionalUrl.default(""),
  siteLanguage: z.string().trim().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, "Use a language code such as en or en-US.").default("en"),
  themeColor: z.string().trim().regex(/^#[0-9a-f]{6}$/i, "Use a six-digit hex color.").default("#C9FF43"),
  searchIndexing: z.boolean().default(true),
  aeoSummary: longTextField.max(700).default(brand.intro),
  expertiseAreas: optionalTextField.max(500).default("Video editing, 2D motion graphics, graphic design, social media creative"),
  serviceArea: optionalTextField.max(200).default("Worldwide"),
  googleSiteVerification: optionalTextField.max(200).default(""),
  bingSiteVerification: optionalTextField.max(200).default(""),
  gtmContainerId: z.string().trim().max(30).refine((value) => !value || /^GTM-[A-Z0-9]+$/i.test(value), "Use a valid GTM container ID such as GTM-XXXXXXX.").default(""),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultSiteContent: SiteContent = {
  name: brand.name,
  monogram: brand.monogram,
  title: brand.title,
  shortTitle: brand.shortTitle,
  headline: brand.headline,
  heroLineOne: "Visual ideas.",
  heroLineTwo: "Made to connect.",
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
  logoUrl: "",
  logoAlt: "Orko Biswas logo",
  faviconUrl: "",
  socialImageUrl: "/og.png",
  profileLinksHeading: "Find me and hire me online.",
  profileLinks: [],
  workHeading: "Selected creative work.",
  workIntro: "Explore video edits, motion graphics, posters, social content, brand visuals, and project bundles.",
  showreelHeading: "A quick look at my work.",
  showreelIntro: "The final reel will show licensed projects only. You can explore the work library while it is being prepared.",
  capabilitiesHeading: "Video, motion, and design.",
  capabilitiesIntro: "I can support one focused task or build a complete set of visuals for your campaign.",
  experienceHeading: "Independent, flexible, and focused on useful creative work.",
  experienceIntro: "A clear view of where I work, what I do now, and the professional experience I choose to publish.",
  experiences: [
    {
      id: "independent-creative-practice",
      organization: "Independent creative practice",
      role: brand.shortTitle,
      period: "Current",
      location: brand.location,
      summary: "I work with brands, businesses, and creators on video editing, motion graphics, graphic design, and connected content packages for different screens.",
    },
  ],
  testimonialsHeading: "Kind words, shared with permission.",
  testimonialsIntro: "Only approved client feedback is published here, with clear names and professional details when they are available.",
  testimonials: [],
  seoTitle: `${brand.name} — Video Editor, Motion Designer & Graphic Designer`,
  seoDescription: brand.intro,
  seoKeywords: "Orko Biswas, video editor, motion designer, graphic designer, Bangladesh, freelance visual designer",
  canonicalUrl: "",
  siteLanguage: "en",
  themeColor: "#C9FF43",
  searchIndexing: true,
  aeoSummary: "Orko Biswas is a Bangladesh-based video editor, motion designer, and graphic designer working with brands and creators worldwide.",
  expertiseAreas: "Video editing, 2D motion graphics, graphic design, promotional videos, social media creative, visual systems",
  serviceArea: "Worldwide",
  googleSiteVerification: "",
  bingSiteVerification: "",
  gtmContainerId: "",
};

export function parseSiteContent(value: unknown): SiteContent {
  const candidate = typeof value === "object" && value ? { ...defaultSiteContent, ...value } : defaultSiteContent;
  const parsed = siteContentSchema.safeParse(candidate);
  return parsed.success ? parsed.data : defaultSiteContent;
}
