import type { CSSProperties } from "react";
import type { Project } from "@/lib/portfolio";
import { ProjectMedia } from "@/components/ProjectMedia";

const frameLabels: Record<Project["ratio"], string> = {
  wide: "16:9 landscape",
  tall: "4:5 poster",
  square: "1:1 square",
  vertical: "9:16 vertical",
  banner: "21:9 banner",
};

export function ProjectArtwork({ project, compact = false }: { project: Project; compact?: boolean }) {
  const style = { "--project-accent": project.accent } as CSSProperties;
  const hasMedia = Boolean(project.mediaUrl && project.mediaType && project.mediaType !== "generated");
  return (
    <div className={`project-art visual-${project.visual} ${compact ? "is-compact" : ""} ${hasMedia ? "has-media" : ""}`} style={style} aria-hidden={hasMedia ? undefined : true}>
      {hasMedia && <ProjectMedia url={project.mediaUrl!} type={project.mediaType as "image" | "video"} alt={project.mediaAlt || `${project.title} project preview`} />}
      <span className="art-index">{project.index}</span>
      <span className="art-kicker">{project.category}</span>
      <span className="art-demo-label">{hasMedia ? "Project media" : "Demo preview"} · {frameLabels[project.ratio]}</span>
      <span className="art-title">{project.title}</span>
      <span className="art-line art-line-one" />
      <span className="art-line art-line-two" />
      <span className="art-shape art-shape-one" />
      <span className="art-shape art-shape-two" />
      <span className="art-grain" />
    </div>
  );
}
