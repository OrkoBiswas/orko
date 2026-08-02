import type { CSSProperties } from "react";
import type { Project } from "@/lib/portfolio";

const frameLabels: Record<Project["ratio"], string> = {
  wide: "16:9 landscape",
  tall: "4:5 poster",
  square: "1:1 square",
  vertical: "9:16 vertical",
  banner: "21:9 banner",
};

export function ProjectArtwork({ project, compact = false }: { project: Project; compact?: boolean }) {
  const style = { "--project-accent": project.accent } as CSSProperties;
  return (
    <div className={`project-art visual-${project.visual} ${compact ? "is-compact" : ""}`} style={style} aria-hidden="true">
      <span className="art-index">{project.index}</span>
      <span className="art-kicker">{project.category}</span>
      <span className="art-demo-label">Demo preview · {frameLabels[project.ratio]}</span>
      <span className="art-title">{project.title}</span>
      <span className="art-line art-line-one" />
      <span className="art-line art-line-two" />
      <span className="art-shape art-shape-one" />
      <span className="art-shape art-shape-two" />
      <span className="art-grain" />
    </div>
  );
}
