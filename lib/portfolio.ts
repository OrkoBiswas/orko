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

export const workDisciplines = [
  { value: "video", label: "Video" },
  { value: "motion", label: "Motion" },
  { value: "design", label: "Design" },
] as const;

export type WorkDiscipline = (typeof workDisciplines)[number]["value"];

export function projectMatchesDiscipline(project: Project, discipline: WorkDiscipline) {
  if (discipline === "video") return project.services.some((service) => ["Video Editing", "YouTube"].includes(service));
  if (discipline === "motion") return project.services.some((service) => service.includes("Motion"));
  return project.services.some((service) => ["Graphic Design", "Brand Visuals", "Social Media"].includes(service));
}

export const projects: Project[] = [
  {
    id: "prj_kinetic_launch",
    slug: "kinetic-launch-film",
    title: "Kinetic Launch Film",
    index: "01",
    category: "Promotional Video",
    services: ["Video Editing", "2D Motion"],
    industry: "Technology",
    client: "Concept Study",
    year: 2026,
    featured: true,
    accent: "#c9ff43",
    visual: "signal",
    ratio: "wide",
    summary: "A fast product video with clear information, strong timing, and a bold visual style.",
    challenge: "Show many product features in a short video without making the screen feel busy.",
    concept: "One strong visual line guides the viewer through every scene and transition.",
    approach: ["Narrative beat map", "Rhythmic rough cut", "Graphic motion system", "Multi-format finishing"],
    deliverables: ["60s launch film", "30s cutdown", "Three vertical edits", "Poster frames"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
  },
  {
    id: "prj_after_hours",
    slug: "after-hours-ident",
    title: "After Hours Ident",
    index: "02",
    category: "2D Motion",
    services: ["2D Motion", "Brand Visuals"],
    industry: "Music & Culture",
    client: "Concept Study",
    year: 2026,
    featured: true,
    accent: "#ff6338",
    visual: "orbit",
    ratio: "vertical",
    summary: "A dark motion identity built with moving type, simple shapes, and printed textures.",
    challenge: "Create one visual style that works for film openings, chapter titles, and short social loops.",
    concept: "A late-night broadcast look with simple geometry and warm texture.",
    approach: ["Identity motion principles", "Modular type grid", "Loop design", "Sound-reactive timing"],
    deliverables: ["Main ident", "Five bumpers", "Vertical loops", "Style frames"],
    tools: ["After Effects", "Illustrator", "Audition"],
  },
  {
    id: "prj_common_ground",
    slug: "common-ground-campaign",
    title: "Common Ground",
    index: "03",
    category: "Branding",
    services: ["Graphic Design", "Social Media"],
    industry: "Community",
    client: "Concept Study",
    year: 2025,
    featured: true,
    accent: "#8aa7ff",
    visual: "editorial",
    ratio: "square",
    summary: "A flexible campaign kit that turns one visual idea into a month of connected social content.",
    challenge: "Create many different posts while keeping every design part of the same campaign.",
    concept: "Bold image crops, clear text, and one simple layout rule connect every story.",
    approach: ["Campaign architecture", "Art-direction system", "Template stress test", "Export playbook"],
    deliverables: ["Campaign key visual", "24 social assets", "Story templates", "Usage guide"],
    tools: ["Photoshop", "Illustrator", "Figma"],
  },
  {
    id: "prj_ninety_seconds",
    slug: "ninety-seconds-forward",
    title: "90 Seconds Forward",
    index: "04",
    category: "Video Editing",
    services: ["Video Editing", "YouTube"],
    industry: "Education",
    client: "Concept Study",
    year: 2026,
    featured: true,
    accent: "#f5d05f",
    visual: "frame",
    ratio: "banner",
    summary: "A clear explainer edit that moves quickly but gives important ideas enough time to land.",
    challenge: "Turn a long interview and supporting footage into a short story while keeping the speaker natural.",
    concept: "Personal interview moments, simple graphics, and quiet pauses create a balanced pace.",
    approach: ["Transcript edit", "Story restructuring", "B-roll map", "Caption and sound pass"],
    deliverables: ["Main edit", "Caption master", "Three chapter clips", "Thumbnail system"],
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
  },
  {
    id: "prj_grown_wild",
    slug: "grown-wild-packaging-film",
    title: "Grown Wild",
    index: "05",
    category: "Advertisement",
    services: ["Video Editing", "Graphic Design"],
    industry: "Food & Beverage",
    client: "Concept Study",
    year: 2025,
    featured: true,
    accent: "#66d889",
    visual: "spectrum",
    ratio: "tall",
    summary: "A lively product story using close-up shots, handmade graphics, and a fast social edit.",
    challenge: "Give a small product range a strong and professional look across video and static design.",
    concept: "Fresh color, direct text, and handmade details bring the ingredients to life.",
    approach: ["Shot selection", "Texture library", "Type animation", "Platform versioning"],
    deliverables: ["20s ad", "6s bumpers", "Product carousel", "Retail poster"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
  },
  {
    id: "prj_open_signal",
    slug: "open-signal-title-sequence",
    title: "Open Signal",
    index: "06",
    category: "2D Motion",
    services: ["2D Motion", "Graphic Design"],
    industry: "Film & Media",
    client: "Concept Study",
    year: 2025,
    featured: true,
    accent: "#ff8e8e",
    visual: "type",
    ratio: "wide",
    summary: "A title sequence where moving text feels like a broadcast signal coming into focus.",
    challenge: "Set the mood for a documentary before the first person begins to speak.",
    concept: "Scan lines, notes, and moving type slowly come together into one clear message.",
    approach: ["Reference edit", "Typographic tests", "Transition grammar", "Final compositing"],
    deliverables: ["45s title sequence", "Lower thirds", "Chapter cards", "Credit package"],
    tools: ["After Effects", "Illustrator", "DaVinci Resolve"],
  },
  {
    id: "prj_one_more_frame",
    slug: "one-more-frame-series",
    title: "One More Frame",
    index: "07",
    category: "YouTube",
    services: ["YouTube", "Graphic Design"],
    industry: "Creator Economy",
    client: "Concept Study",
    year: 2026,
    featured: false,
    accent: "#c9ff43",
    visual: "frame",
    ratio: "square",
    summary: "A reusable editing and design system for video essays, chapter graphics, thumbnails, and short clips.",
    challenge: "Keep weekly videos consistent without making every episode look the same.",
    concept: "Editing marks, image crops, and story notes become part of the channel style.",
    approach: ["Content review", "Main edit", "Thumbnail design", "Reusable motion templates"],
    deliverables: ["12-minute edit", "Thumbnail set", "Chapter system", "Five shorts"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
  },
  {
    id: "prj_future_tastes",
    slug: "future-tastes-social-system",
    title: "Future Tastes",
    index: "08",
    category: "Social Media",
    services: ["Social Media", "2D Motion"],
    industry: "Hospitality",
    client: "Concept Study",
    year: 2026,
    featured: false,
    accent: "#bd8cff",
    visual: "orbit",
    ratio: "vertical",
    summary: "A bright motion and design system for launches, menus, stories, and regular social posts.",
    challenge: "Create a social style that is easy to use every day and strong enough to catch attention.",
    concept: "Clear type, soft shapes, and quick movement give the brand a fresh look.",
    approach: ["Content plan", "Motion style", "Template library", "Team handoff"],
    deliverables: ["Launch reel", "18 post templates", "12 story layouts", "Motion guide"],
    tools: ["After Effects", "Photoshop", "Figma"],
  },
  {
    id: "prj_detail_matters",
    slug: "detail-matters-poster-set",
    title: "Detail Matters",
    index: "09",
    category: "Posters",
    services: ["Graphic Design"],
    industry: "Design & Culture",
    client: "Self-initiated",
    year: 2025,
    featured: false,
    accent: "#ff6338",
    visual: "editorial",
    ratio: "tall",
    summary: "A poster series that explores type, space, scale, and printed texture.",
    challenge: "Keep one clear series style while giving every poster its own layout.",
    concept: "Each poster follows one simple design rule and removes anything unnecessary.",
    approach: ["Layout studies", "Type pairing", "Print texture", "Final selection"],
    deliverables: ["12 poster artworks", "Social crops", "Print-ready masters"],
    tools: ["Photoshop", "Illustrator", "InDesign"],
  },
  {
    id: "prj_ten_second_story",
    slug: "ten-second-story",
    title: "Ten Second Story",
    index: "10",
    category: "Short-Form",
    services: ["Video Editing", "Social Media"],
    industry: "Lifestyle",
    client: "Concept Study",
    year: 2026,
    featured: false,
    accent: "#61d7e8",
    visual: "signal",
    ratio: "vertical",
    summary: "A set of ten-second vertical videos with a clear opening, change, and ending.",
    challenge: "Create several very short edits without making them loud or repetitive.",
    concept: "Each video uses one simple action: fold, snap, reveal, or repeat.",
    approach: ["Opening ideas", "Short storyboards", "Sound timing", "Final versions"],
    deliverables: ["Eight vertical edits", "Caption styles", "Cover frames"],
    tools: ["Premiere Pro", "After Effects", "Audition"],
  },
  {
    id: "prj_quiet_power",
    slug: "quiet-power-brand-film",
    title: "Quiet Power",
    index: "11",
    category: "Branding",
    services: ["Video Editing", "Brand Visuals"],
    industry: "Wellness",
    client: "Concept Study",
    year: 2025,
    featured: false,
    accent: "#d8c5a3",
    visual: "spectrum",
    ratio: "wide",
    summary: "A calm brand video using natural images, slow pace, and simple typography.",
    challenge: "Create a peaceful feeling while keeping the video clear and memorable.",
    concept: "Slow camera movement, clean edits, and carefully placed text create quiet confidence.",
    approach: ["Mood edit", "Pacing plan", "Simple graphic style", "Color finish"],
    deliverables: ["75s brand film", "15s cutdown", "Still campaign set"],
    tools: ["Premiere Pro", "DaVinci Resolve", "After Effects"],
  },
  {
    id: "prj_abstract_index",
    slug: "abstract-index-thumbnails",
    title: "Abstract Index",
    index: "12",
    category: "Thumbnails",
    services: ["Graphic Design", "YouTube"],
    industry: "Education",
    client: "Concept Study",
    year: 2026,
    featured: false,
    accent: "#7aa7ff",
    visual: "type",
    ratio: "square",
    summary: "A thumbnail system that builds interest with clear type and strong image choices.",
    challenge: "Make covers that are easy to read at small sizes and consistent across many topics.",
    concept: "One subject, one short phrase, and one clear visual detail lead each thumbnail.",
    approach: ["Content groups", "Small-size tests", "Layout options", "Archive system"],
    deliverables: ["20 thumbnail concepts", "Source templates", "Usage matrix"],
    tools: ["Photoshop", "Illustrator", "Figma"],
  },
];

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

export const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];

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
      (!options.category || options.category === "All" || project.category === options.category) &&
      (!options.industry || options.industry === "All" || project.industry === options.industry) &&
      (!options.year || options.year === "All" || String(project.year) === options.year)
    );
  });
}
