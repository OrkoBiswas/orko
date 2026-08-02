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
};

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
    summary: "A fast, tactile product reveal designed around clarity, tempo, and one unmistakable visual pulse.",
    challenge: "Turn a feature-heavy launch into a short film that feels exciting without becoming visually noisy.",
    concept: "One signal cuts through the noise. Every transition follows a single directional system.",
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
    summary: "A nocturnal identity system built from orbiting type, elastic timing, and imperfect print texture.",
    challenge: "Create a channel identity that can open a film, label a chapter, or live as a ten-second social loop.",
    concept: "Late-night transmission: minimal geometry interrupted by warm, human texture.",
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
    summary: "A flexible campaign kit that turns one editorial idea into a month of coherent social storytelling.",
    challenge: "Build variety for a high-volume campaign while keeping each post unmistakably part of one voice.",
    concept: "Different stories share a visual baseline: bold crops, open captions, and one connective rule.",
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
    summary: "An editorial explainer cut that moves quickly, breathes at the right moments, and keeps the idea in focus.",
    challenge: "Condense a dense interview and supporting footage into a concise story without flattening the speaker’s voice.",
    concept: "Momentum through contrast: intimate statements, graphic proof, and purposeful silence.",
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
    summary: "A tactile product story mixing macro detail, hand-cut graphics, and an energetic social-first edit.",
    challenge: "Give a small product range a distinctive, premium launch language across film and static media.",
    concept: "Ingredients in motion—fresh color, direct copy, and a handmade edge.",
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
    summary: "A title sequence where typography behaves like a broadcast searching for its frequency.",
    challenge: "Introduce a documentary theme with atmosphere and tension before the first spoken word.",
    concept: "A message resolving from fragments: scan lines, field notes, and controlled typographic drift.",
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
    summary: "A repeatable editorial system for video essays, chapter graphics, thumbnails, and short-form cutdowns.",
    challenge: "Increase production consistency without making a creator’s weekly output feel templated.",
    concept: "A visible editing desk: marks, crops, and story evidence become the visual identity.",
    approach: ["Format audit", "Retention edit", "Package design", "Reusable motion toolkit"],
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
    summary: "A bright, modular motion system made for launches, menus, stories, and weekly social rhythm.",
    challenge: "Create a social identity broad enough for daily use and bold enough to stop a fast scroll.",
    concept: "Menus from tomorrow—sharp type, soft circles, and quick elastic movement.",
    approach: ["Content pillars", "Motion tokens", "Template library", "Team handoff"],
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
    summary: "An experimental poster library exploring scale, compression, negative space, and typographic voice.",
    challenge: "Build a recognizable series while letting every poster explore a different compositional tension.",
    concept: "One rule per poster. Every unnecessary gesture is removed.",
    approach: ["Constraint studies", "Type pairing", "Print texture", "Series curation"],
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
    summary: "A short-form study proving that hook, change, and payoff can still feel authored in ten seconds.",
    challenge: "Make multiple ultra-short versions without reducing the idea to noisy, interchangeable content.",
    concept: "One visual verb per cut: fold, snap, reveal, repeat.",
    approach: ["Hook variations", "Micro storyboards", "Sound punctuation", "Version matrix"],
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
    summary: "A restrained brand film using pace, natural texture, and spacious type instead of familiar wellness clichés.",
    challenge: "Communicate calm with enough contrast and structure to remain memorable.",
    concept: "Confidence at low volume. Slow camera, crisp edits, and typography that arrives only when needed.",
    approach: ["Mood edit", "Pacing map", "Minimal graphic language", "Color finish"],
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
    summary: "A thumbnail system designed to create curiosity with hierarchy, not exaggeration.",
    challenge: "Build high-contrast covers that remain credible, readable at small sizes, and consistent across topics.",
    concept: "The index card meets the moving image: one subject, one phrase, one visual interruption.",
    approach: ["Content grouping", "Small-size tests", "Variant framework", "Archive system"],
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
    short: "Story-first edits with rhythm, clarity, and polish.",
    promise: "Turn raw footage and ideas into a focused story that earns attention and holds it.",
    deliverables: ["Brand and promotional films", "YouTube and interview edits", "Campaign cutdowns", "Color, sound, and captions"],
    idealFor: ["Brands launching something", "Creators building a consistent channel", "Agencies needing reliable post-production"],
    timeline: "Most focused edits: 1–4 weeks",
    pricing: "Custom quote after scope",
    related: ["kinetic-launch-film", "ninety-seconds-forward", "quiet-power-brand-film"],
    faqs: [{ question: "Can you work with an existing script?", answer: "Yes. I can edit from a locked script or help reshape the story from transcripts and source material." }],
  },
  {
    slug: "2d-motion-graphics",
    number: "02",
    title: "2D Motion Graphics",
    short: "Motion that explains, identifies, and adds energy.",
    promise: "Build a motion language that supports the message instead of decorating around it.",
    deliverables: ["Titles and idents", "Explainer animation", "Kinetic typography", "Motion toolkits"],
    idealFor: ["Film and media teams", "Product and campaign launches", "Brands building motion consistency"],
    timeline: "Typically 2–5 weeks",
    pricing: "Custom quote after scope",
    related: ["after-hours-ident", "open-signal-title-sequence", "future-tastes-social-system"],
    faqs: [{ question: "Do you provide source files?", answer: "Editable source-file handoff can be included when it is useful for your team and agreed in the scope." }],
  },
  {
    slug: "graphic-design",
    number: "03",
    title: "Graphic Design",
    short: "Strong hierarchy for posters, campaigns, decks, and digital assets.",
    promise: "Create clear, ownable visual communication that works across formats and attention spans.",
    deliverables: ["Campaign key visuals", "Posters and print", "Presentation visuals", "Digital design systems"],
    idealFor: ["Campaign and events teams", "Founders refining their visual voice", "Studios needing production support"],
    timeline: "Typically 1–4 weeks",
    pricing: "Custom quote after scope",
    related: ["common-ground-campaign", "detail-matters-poster-set", "abstract-index-thumbnails"],
    faqs: [{ question: "Can one direction scale to many assets?", answer: "Yes. I design the underlying hierarchy and rules first, then stress-test them across the required formats." }],
  },
  {
    slug: "social-media-visuals",
    number: "04",
    title: "Social Media Visuals",
    short: "A content system—not a folder of disconnected posts.",
    promise: "Give frequent content enough range to stay fresh and enough structure to stay recognizable.",
    deliverables: ["Social campaigns", "Post and story templates", "Animated loops", "Content design guides"],
    idealFor: ["In-house social teams", "Hospitality and lifestyle brands", "Creators with frequent publishing"],
    timeline: "System builds: 2–4 weeks",
    pricing: "Custom quote after scope",
    related: ["future-tastes-social-system", "common-ground-campaign", "ten-second-story"],
    faqs: [{ question: "Can my team edit the templates?", answer: "Yes. When requested, I structure handoff files and a concise guide around the tools your team already uses." }],
  },
  {
    slug: "promotional-creatives",
    number: "05",
    title: "Promotional Creatives",
    short: "Campaign assets shaped around one persuasive idea.",
    promise: "Translate a launch or offer into a coherent set of film, motion, and static creative.",
    deliverables: ["Launch films", "Paid social assets", "Cutdowns and bumpers", "Key visuals"],
    idealFor: ["Product launches", "Events and campaigns", "Agencies expanding a creative route"],
    timeline: "Typically 2–6 weeks",
    pricing: "Custom quote after scope",
    related: ["kinetic-launch-film", "grown-wild-packaging-film", "quiet-power-brand-film"],
    faqs: [{ question: "Do you make platform-specific versions?", answer: "Yes. Versioning is planned at the beginning so every delivery feels composed for its placement." }],
  },
  {
    slug: "youtube-short-form",
    number: "06",
    title: "YouTube & Short-Form",
    short: "Retention-conscious content with an authored visual voice.",
    promise: "Make content easier to follow, more satisfying to watch, and recognizable from one episode to the next.",
    deliverables: ["Long-form YouTube edits", "Short-form cutdowns", "Thumbnails", "Channel graphics"],
    idealFor: ["Experts and educators", "Video essay creators", "Brand channels"],
    timeline: "Per episode or monthly system",
    pricing: "Custom quote after scope",
    related: ["one-more-frame-series", "ninety-seconds-forward", "abstract-index-thumbnails"],
    faqs: [{ question: "Can you repurpose long content?", answer: "Yes. I can identify self-contained moments and adapt them for vertical viewing without losing context." }],
  },
  {
    slug: "brand-visual-support",
    number: "07",
    title: "Brand Visual Support",
    short: "A flexible creative partner for launches and ongoing delivery.",
    promise: "Keep execution consistent when a brand needs more formats, more motion, or more production capacity.",
    deliverables: ["Campaign extensions", "Motion guidelines", "Design production", "Multi-format delivery"],
    idealFor: ["Design teams under load", "Agencies between concept and delivery", "Growing brands"],
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
  options: { query?: string; category?: string; industry?: string; year?: string },
) {
  const query = options.query?.trim().toLowerCase() ?? "";
  return items.filter((project) => {
    const searchable = [project.title, project.category, project.industry, ...project.services].join(" ").toLowerCase();
    return (
      (!query || searchable.includes(query)) &&
      (!options.category || options.category === "All" || project.category === options.category) &&
      (!options.industry || options.industry === "All" || project.industry === options.industry) &&
      (!options.year || options.year === "All" || String(project.year) === options.year)
    );
  });
}
