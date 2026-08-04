import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { ProjectArtwork } from "@/components/ProjectArtwork";

const frameLabels: Record<Project["ratio"], string> = {
  wide: "Landscape · 16:9",
  vertical: "Vertical · 9:16",
  square: "Square · 1:1",
  tall: "Poster · 4:5",
  banner: "Banner · 21:9",
};

export function ProjectCard({ project, priority = false, variant = "default" }: { project: Project; priority?: boolean; variant?: "default" | "showcase" }) {
  if (variant === "showcase") {
    return (
      <article className={`project-card showcase-piece ratio-${project.ratio}`} data-project-card data-index={project.index} data-priority={priority || undefined}>
        <Link href={`/work/${project.slug}`} aria-label={`Open ${project.title} showcase item`} data-cursor="project">
          <div className="showcase-piece-index" aria-hidden="true"><span>Project</span><strong>{project.index}</strong><i /></div>
          <div className="showcase-piece-media">
            <ProjectArtwork project={project} />
            <span className="showcase-piece-media-label" aria-hidden="true">{project.category}<i />{frameLabels[project.ratio]}</span>
          </div>
          <div className="showcase-piece-info">
            <div className="showcase-piece-heading"><span>Selected chapter</span><h3>{project.title}</h3></div>
            <p>{project.summary}</p>
            <dl className="showcase-piece-meta" aria-label={`${project.title} project details`}><div><dt>Client</dt><dd>{project.client || "Independent"}</dd></div><div><dt>Industry</dt><dd>{project.industry}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div></dl>
            <div className="showcase-piece-action"><span>{project.services.slice(0, 2).join(" + ")}</span><strong>Open project <ArrowUpRight aria-hidden="true" /></strong></div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={`project-card ratio-${project.ratio}`} data-project-card data-priority={priority || undefined}>
      <Link href={`/work/${project.slug}`} aria-label={`Open ${project.title} showcase`} data-cursor="project">
        <ProjectArtwork project={project} />
        <div className="project-card-meta">
          <div><p>{project.title}</p><span>{project.category} · {project.industry}</span></div>
          <div><span>{project.year}</span><ArrowUpRight aria-hidden="true" /></div>
        </div>
      </Link>
    </article>
  );
}
