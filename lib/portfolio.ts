export type Project = {
  id: string;
  slug: string;
  title: string;
  index: string;
  category: string;
  services: string[];
  industry: string;
  client: string;
  year: number;
  featured: boolean;
  accent: string;
  visual: "orbit" | "signal" | "editorial" | "spectrum" | "type" | "frame";
  ratio: "wide" | "tall" | "square" | "vertical" | "banner";
  summary: string;
  challenge: string;
  concept: string;
  approach: string[];
  deliverables: string[];
  tools: string[];
  mediaUrl?: string;
  mediaType?: "generated" | "image" | "video";
  mediaAlt?: string;
  gallery?: ProjectGalleryItem[];
  contentBlocks?: ProjectContentBlock[];
  presentation?: ProjectPresentation;
  customCta?: ProjectCustomCta;
  assets?: ProjectAsset[];
};

export type ProjectBlockWidth = "compact" | "standard" | "wide" | "full";

export type ProjectBlockMedia = {
  id: string;
  url: string;
  alt: string;
};

export type ProjectContentBlock =
  | { id: string; type: "image"; width: ProjectBlockWidth; url: string; alt: string; caption: string }
  | { id: string; type: "text"; width: Exclude<ProjectBlockWidth, "full">; style: "heading" | "body" | "quote"; align: "left" | "center"; heading: string; body: string }
  | { id: string; type: "photo-grid"; width: ProjectBlockWidth; columns: 2 | 3; gap: "none" | "small" | "medium"; items: ProjectBlockMedia[] }
  | { id: string; type: "video-audio"; width: ProjectBlockWidth; mediaType: "video" | "audio"; url: string; posterUrl: string; alt: string; caption: string }
  | { id: string; type: "embed"; width: ProjectBlockWidth; url: string; title: string; caption: string }
  | { id: string; type: "lightroom"; width: ProjectBlockWidth; beforeUrl: string; afterUrl: string; alt: string; caption: string }
  | { id: string; type: "prototype" | "3d"; width: ProjectBlockWidth; url: string; title: string; description: string }
  | { id: string; type: "divider"; width: Exclude<ProjectBlockWidth, "full">; size: "small" | "medium" | "large" };

export type ProjectPresentation = {
  background: string;
  textColor: string;
  contentWidth: "standard" | "wide" | "full";
  spacing: "compact" | "balanced" | "airy";
};

export type ProjectCustomCta = {
  enabled: boolean;
  label: string;
  url: string;
};

export type ProjectAsset = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export type ProjectGalleryItem = {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string;
  title: string;
  category: string;
  client: string;
  industry: string;
  year: number | null;
};

export const showreelMedia = {
  videoUrl: "https://res.cloudinary.com/dbq2cv0an/video/upload/f_mp4,q_auto:good/twjrdvsw3twharx3w0kx.mp4",
  posterUrl: "https://res.cloudinary.com/dbq2cv0an/video/upload/so_0,f_jpg,q_auto:good/twjrdvsw3twharx3w0kx.jpg",
  label: "Orko Biswas motion showreel",
} as const;

export const footerContent = {
  availabilityLead: "Available for the right creative project",
  headlineLead: "Have a story?",
  headlineAccent: "Let's make it move.",
  support: "Tell me what you are making, what you need, and when you need it. I will reply with a clear next step.",
  identityNote: "Video editing, motion design, and graphic design for brands, businesses, and creators.",
} as const;

export const aboutPageContent = {
  headlineLead: "A visual designer",
  headlineAccent: "who keeps ideas clear.",
  workLifeHeading: "Curious by habit.",
  workLife: "My workday moves between editing timelines, motion tests, layout studies, and the small details that make a visual feel finished.",
  careerHeading: "Growing with every brief.",
  career: "I am building an independent creative career by solving real communication problems for brands, businesses, and creators.",
  clientCareHeading: "Clear from start to finish.",
  clientCare: "I listen carefully, explain decisions in simple language, keep feedback organized, and deliver work that is ready to use.",
} as const;

export const workDisciplines = [
  { value: "video", label: "Video" },
  { value: "motion", label: "Motion" },
  { value: "design", label: "Design" },
] as const;

export type WorkDiscipline = (typeof workDisciplines)[number]["value"];

export type ShowcaseCategory = string;

export type ShowcaseCategoryDefinition = {
  value: ShowcaseCategory;
  label: string;
  description: string;
};

export const showcaseCategories: ShowcaseCategoryDefinition[] = [];

export function categorySlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "uncategorized";
}

export function deriveShowcaseCategories(items: Project[]): ShowcaseCategoryDefinition[] {
  const seen = new Set<string>();
  return items.flatMap((project) => {
    const label = project.category.trim();
    if (!label) return [];
    const value = categorySlug(label);
    if (seen.has(value)) return [];
    seen.add(value);
    return [{ value, label, description: `${label} projects and complete visual presentations.` }];
  });
}

export function getShowcaseCategory(value: string, definitions: ShowcaseCategoryDefinition[] = showcaseCategories) {
  const normalized = categorySlug(value);
  return definitions.find((item) => item.value === normalized || categorySlug(item.label) === normalized);
}

export function projectMatchesDiscipline(project: Project, discipline: WorkDiscipline) {
  if (discipline === "video") return project.services.some((service) => ["Video Editing", "YouTube"].includes(service));
  if (discipline === "motion") return project.services.some((service) => service.includes("Motion"));
  return project.services.some((service) => ["Graphic Design", "Brand Visuals", "Social Media"].includes(service));
}

export function projectMatchesShowcaseCategory(project: Project, category: ShowcaseCategory) {
  return categorySlug(project.category) === categorySlug(category);
}

export function galleryItemMatchesShowcaseCategory(item: ProjectGalleryItem, category: ShowcaseCategory) {
  return categorySlug(item.category) === categorySlug(category);
}

export function projectCategoryWorkCount(project: Project, category: ShowcaseCategory) {
  return projectMatchesShowcaseCategory(project, category) ? 1 : 0;
}

export function getProjectPreviewMedia(project: Project): { url: string; type: "image" | "video"; alt: string } | null {
  for (const block of project.contentBlocks ?? []) {
    if (block.type === "image" && block.url) return { url: block.url, type: "image", alt: block.alt || `${project.title} preview` };
    if (block.type === "photo-grid") {
      const item = block.items.find((media) => media.url);
      if (item) return { url: item.url, type: "image", alt: item.alt || `${project.title} preview` };
    }
    if (block.type === "video-audio" && block.mediaType === "video" && block.url) return { url: block.url, type: "video", alt: block.alt || `${project.title} preview` };
    if (block.type === "lightroom" && (block.afterUrl || block.beforeUrl)) return { url: block.afterUrl || block.beforeUrl, type: "image", alt: block.alt || `${project.title} preview` };
  }
  if (project.mediaUrl && (project.mediaType === "image" || project.mediaType === "video")) {
    return { url: project.mediaUrl, type: project.mediaType, alt: project.mediaAlt || `${project.title} preview` };
  }
  return null;
}

export const projects: Project[] = [];
export type Service = {
  slug: string;
  number: string;
  title: string;
  short: string;
  promise: string;
  deliverables: string[];
  idealFor: string[];
  timeline: string;
  pricing: string;
  related: string[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "video-editing",
    number: "01",
    title: "Video Editing",
    short: "Clear, well-paced videos with a professional finish.",
    promise: "Turn your raw footage and ideas into a focused video that is easy to follow and enjoyable to watch.",
    deliverables: ["Brand and promotional videos", "YouTube and interview edits", "Short campaign versions", "Color, sound, and captions"],
    idealFor: ["Brands launching a product or service", "Creators building a regular channel", "Agencies needing editing support"],
    timeline: "Most focused edits: 1–4 weeks",
    pricing: "Custom quote after scope",
    related: ["kinetic-launch-film", "ninety-seconds-forward", "quiet-power-brand-film"],
    faqs: [{ question: "Can you work with an existing script?", answer: "Yes. I can edit from a locked script or help reshape the story from transcripts and source material." }],
  },
  {
    slug: "2d-motion-graphics",
    number: "02",
    title: "2D Motion Graphics",
    short: "Smooth animation that explains ideas and adds energy.",
    promise: "Create motion graphics that support your message and match your brand style.",
    deliverables: ["Titles and idents", "Explainer animation", "Kinetic typography", "Motion toolkits"],
    idealFor: ["Film and media teams", "Product and campaign launches", "Brands that need a consistent motion style"],
    timeline: "Typically 2–5 weeks",
    pricing: "Custom quote after scope",
    related: ["after-hours-ident", "open-signal-title-sequence", "future-tastes-social-system"],
    faqs: [{ question: "Do you provide source files?", answer: "Editable source-file handoff can be included when it is useful for your team and agreed in the scope." }],
  },
  {
    slug: "graphic-design",
    number: "03",
    title: "Graphic Design",
    short: "Clear design for posters, campaigns, presentations, and digital content.",
    promise: "Create strong visual work that is easy to understand and consistent across formats.",
    deliverables: ["Campaign key visuals", "Posters and print", "Presentation visuals", "Digital design systems"],
    idealFor: ["Campaign and event teams", "Founders improving their brand look", "Studios needing design support"],
    timeline: "Typically 1–4 weeks",
    pricing: "Custom quote after scope",
    related: ["common-ground-campaign", "detail-matters-poster-set", "abstract-index-thumbnails"],
    faqs: [{ question: "Can one design style work across many assets?", answer: "Yes. I build a clear visual system first, then test it across every size and format you need." }],
  },
  {
    slug: "social-media-visuals",
    number: "04",
    title: "Social Media Visuals",
    short: "Connected social content that stays fresh and recognizable.",
    promise: "Build a flexible visual system for regular posts, stories, campaigns, and animated content.",
    deliverables: ["Social campaigns", "Post and story templates", "Animated loops", "Content design guides"],
    idealFor: ["Social media teams", "Hospitality and lifestyle brands", "Creators who publish often"],
    timeline: "System builds: 2–4 weeks",
    pricing: "Custom quote after scope",
    related: ["future-tastes-social-system", "common-ground-campaign", "ten-second-story"],
    faqs: [{ question: "Can my team edit the templates?", answer: "Yes. When requested, I structure handoff files and a concise guide around the tools your team already uses." }],
  },
  {
    slug: "promotional-creatives",
    number: "05",
    title: "Promotional Creatives",
    short: "A connected set of campaign assets built around one clear idea.",
    promise: "Turn your launch or offer into video, motion, and static visuals that work together.",
    deliverables: ["Launch films", "Paid social assets", "Cutdowns and bumpers", "Key visuals"],
    idealFor: ["Product launches", "Events and campaigns", "Agencies that need more campaign assets"],
    timeline: "Typically 2–6 weeks",
    pricing: "Custom quote after scope",
    related: ["kinetic-launch-film", "grown-wild-packaging-film", "quiet-power-brand-film"],
    faqs: [{ question: "Do you make platform-specific versions?", answer: "Yes. Versioning is planned at the beginning so every delivery feels composed for its placement." }],
  },
  {
    slug: "youtube-short-form",
    number: "06",
    title: "YouTube & Short-Form",
    short: "Easy-to-follow videos with a clear and consistent style.",
    promise: "Make long and short content more engaging while keeping your channel easy to recognize.",
    deliverables: ["Long-form YouTube edits", "Short-form cutdowns", "Thumbnails", "Channel graphics"],
    idealFor: ["Experts and teachers", "Video essay creators", "Brand and business channels"],
    timeline: "Per episode or monthly system",
    pricing: "Custom quote after scope",
    related: ["one-more-frame-series", "ninety-seconds-forward", "abstract-index-thumbnails"],
    faqs: [{ question: "Can you repurpose long content?", answer: "Yes. I can identify self-contained moments and adapt them for vertical viewing without losing context." }],
  },
  {
    slug: "brand-visual-support",
    number: "07",
    title: "Brand Visual Support",
    short: "Flexible creative support for launches and regular content.",
    promise: "Keep your visual work consistent when you need more formats, motion, design, or production help.",
    deliverables: ["Campaign extensions", "Motion guidelines", "Design production", "Multi-format delivery"],
    idealFor: ["Busy design teams", "Agencies moving from idea to delivery", "Growing brands"],
    timeline: "Project or retained collaboration",
    pricing: "Custom quote after scope",
    related: ["common-ground-campaign", "after-hours-ident", "quiet-power-brand-film"],
    faqs: [{ question: "Can you work inside an existing brand system?", answer: "Yes. I can extend a mature system carefully or help define missing visual and motion rules." }],
  },
];

export const categories = ["All"];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function filterProjects(
  items: Project[],
  options: { query?: string; discipline?: WorkDiscipline | "All"; category?: string; industry?: string; year?: string },
) {
  const query = options.query?.trim().toLowerCase() ?? "";
  return items.filter((project) => {
    const searchable = [project.title, project.category, project.industry, ...project.services].join(" ").toLowerCase();
    return (
      (!query || searchable.includes(query)) &&
      (!options.discipline || options.discipline === "All" || projectMatchesDiscipline(project, options.discipline)) &&
      (!options.category || options.category === "All" || projectMatchesShowcaseCategory(project, options.category)) &&
      (!options.industry || options.industry === "All" || project.industry === options.industry) &&
      (!options.year || options.year === "All" || String(project.year) === options.year)
    );
  });
}
