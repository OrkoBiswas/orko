import type { CSSProperties } from "react";
import type { Project } from "@/lib/portfolio";

export function ProjectArtwork({ project, compact = false }: { project: Project; compact?: boolean }) {
  const style = { "--project-accent": project.accent } as CSSProperties;
  return (
    <div className={`project-art visual-${project.visual} ${compact ? "is-compact" : ""}`} style={style} aria-hidden="true">
      <span className="art-index">{project.index}</span>
      <span className="art-kicker">{project.category}</span>
      <span className="art-demo-label">Demo preview</span>
      <span className="art-title">{project.title}</span>
      <span className="art-line art-line-one" />
      <span className="art-line art-line-two" />
      <span className="art-shape art-shape-one" />
      <span className="art-shape art-shape-two" />
      <span className="art-grain" />
    </div>
  );
}
