import type { CSSProperties } from "react";
import { ArrowDownToLine, ArrowUpRight, Box, MousePointer2 } from "lucide-react";
import { ProjectMedia } from "@/components/ProjectMedia";
import type { Project, ProjectContentBlock, ProjectPresentation as PresentationSettings } from "@/lib/portfolio";

const defaultPresentation: PresentationSettings = { background: "#f4f2ea", textColor: "#171a16", contentWidth: "wide", spacing: "balanced" };

function legacyContent(project: Project): ProjectContentBlock[] {
  const galleryBlocks = (project.gallery ?? []).filter((item) => item.url !== project.mediaUrl).map((item) => item.type === "video" ? {
    id: `legacy-${item.id}`,
    type: "video-audio" as const,
    width: "wide" as const,
    mediaType: "video" as const,
    url: item.url,
    posterUrl: "",
    alt: item.alt,
    caption: item.title,
  } : {
    id: `legacy-${item.id}`,
    type: "image" as const,
    width: "wide" as const,
    url: item.url,
    alt: item.alt,
    caption: item.title,
  });
  if (galleryBlocks.length) return galleryBlocks;
  return [
    { id: `${project.id}-intro`, type: "text", width: "wide", style: "quote", align: "left", heading: "", body: project.summary },
    { id: `${project.id}-challenge`, type: "text", width: "standard", style: "heading", align: "left", heading: "The challenge", body: project.challenge },
    { id: `${project.id}-direction`, type: "text", width: "standard", style: "body", align: "left", heading: "Creative direction", body: project.concept },
  ];
}

function supportedEmbed(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${encodeURIComponent(url.pathname.slice(1))}`;
    if (host === "youtube.com") {
      const id = url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com" && url.pathname.startsWith("/video/")) return url.toString();
    if (host === "figma.com") return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url.toString())}`;
    if (host === "sketchfab.com" && url.pathname.includes("/embed")) return url.toString();
  } catch {
    return null;
  }
  return null;
}

function Paragraphs({ value }: { value: string }) {
  return <>{value.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>)}</>;
}

function ExternalPresentation({ block }: { block: Extract<ProjectContentBlock, { type: "prototype" | "3d" }> }) {
  const embed = supportedEmbed(block.url);
  if (embed) return <div className="project-embed-frame"><iframe src={embed} title={block.title || (block.type === "3d" ? "3D project presentation" : "Interactive prototype")} loading="lazy" allow="fullscreen; autoplay; clipboard-write" allowFullScreen /></div>;
  const Icon = block.type === "3d" ? Box : MousePointer2;
  return block.url ? <a className="project-external-block" href={block.url} target="_blank" rel="noreferrer"><Icon aria-hidden="true" /><span><small>{block.type === "3d" ? "3D presentation" : "Interactive prototype"}</small><strong>{block.title || "Open experience"}</strong>{block.description && <p>{block.description}</p>}</span><ArrowUpRight aria-hidden="true" /></a> : null;
}

export function ProjectPresentation({ project }: { project: Project }) {
  const blocks = project.contentBlocks?.length ? project.contentBlocks : legacyContent(project);
  const presentation = project.presentation ?? defaultPresentation;
  const style = {
    "--project-background": presentation.background,
    "--project-text": presentation.textColor,
  } as CSSProperties;

  return <section className={`project-presentation is-${presentation.contentWidth} spacing-${presentation.spacing}`} style={style} aria-label={`${project.title} project presentation`}>
    <div className="project-presentation-stack">
      {blocks.map((block) => {
        const className = `project-presentation-block width-${block.width} type-${block.type}`;
        if (block.type === "image") return block.url ? <figure className={className} key={block.id}><ProjectMedia url={block.url} type="image" alt={block.alt || `${project.title} project image`} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure> : null;
        if (block.type === "text") return block.heading || block.body ? <div className={`${className} style-${block.style} align-${block.align}`} key={block.id}>{block.heading && <h2>{block.heading}</h2>}<div><Paragraphs value={block.body} /></div></div> : null;
        if (block.type === "photo-grid") return block.items.length ? <div className={`${className} columns-${block.columns} gap-${block.gap}`} key={block.id}>{block.items.map((item) => <ProjectMedia key={item.id} url={item.url} type="image" alt={item.alt || `${project.title} project image`} />)}</div> : null;
        if (block.type === "video-audio") return block.url ? <figure className={className} key={block.id}>{block.mediaType === "video" ? <ProjectMedia url={block.url} type="video" alt={block.alt || `${project.title} project video`} controls /> : <audio src={block.url} controls preload="metadata" aria-label={block.alt || `${project.title} project audio`} />}{block.caption && <figcaption>{block.caption}</figcaption>}</figure> : null;
        if (block.type === "embed") {
          const embed = supportedEmbed(block.url);
          return block.url ? <figure className={className} key={block.id}>{embed ? <div className="project-embed-frame"><iframe src={embed} title={block.title || `${project.title} embedded presentation`} loading="lazy" allow="fullscreen; autoplay; clipboard-write" allowFullScreen /></div> : <a className="project-external-block" href={block.url} target="_blank" rel="noreferrer"><CodeMark /><span><small>External presentation</small><strong>{block.title || "Open embedded content"}</strong></span><ArrowUpRight aria-hidden="true" /></a>}{block.caption && <figcaption>{block.caption}</figcaption>}</figure> : null;
        }
        if (block.type === "lightroom") return block.beforeUrl || block.afterUrl ? <figure className={className} key={block.id}><div className="project-lightroom"><div>{block.beforeUrl && <ProjectMedia url={block.beforeUrl} type="image" alt={`${block.alt || project.title} before edit`} />}<span>Before</span></div><div>{block.afterUrl && <ProjectMedia url={block.afterUrl} type="image" alt={`${block.alt || project.title} after edit`} />}<span>After</span></div></div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure> : null;
        if (block.type === "prototype" || block.type === "3d") return <div className={className} key={block.id}><ExternalPresentation block={block} /></div>;
        if (block.type === "divider") return <div className={`${className} size-${block.size}`} aria-hidden="true" key={block.id}><span /></div>;
        return null;
      })}
    </div>

    {(project.deliverables.length > 0 || project.tools.length > 0 || project.assets?.length || project.customCta?.enabled) && <footer className="project-presentation-footer">
      <div className="project-presentation-credits">
        {project.deliverables.length > 0 && <div><span>Deliverables</span><p>{project.deliverables.join(" · ")}</p></div>}
        {project.tools.length > 0 && <div><span>Tools</span><p>{project.tools.join(" · ")}</p></div>}
      </div>
      {project.assets?.length ? <div className="project-asset-downloads"><p>Project assets</p>{project.assets.map((asset) => <a href={asset.url} target="_blank" rel="noreferrer" key={asset.id}><span><strong>{asset.name}</strong>{asset.description && <small>{asset.description}</small>}</span><ArrowDownToLine aria-hidden="true" /></a>)}</div> : null}
      {project.customCta?.enabled && project.customCta.url && <a className="project-custom-cta" href={project.customCta.url} target="_blank" rel="noreferrer"><span>{project.customCta.label || "Visit project"}</span><ArrowUpRight aria-hidden="true" /></a>}
    </footer>}
  </section>;
}

function CodeMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18-6-6 6-6M15 6l6 6-6 6M14 3l-4 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
