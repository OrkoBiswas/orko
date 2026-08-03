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
      <article className={`project-card showcase-card ratio-${project.ratio}`} data-project-card data-priority={priority || undefined}>
        <Link href={`/work/${project.slug}`} aria-label={`Open ${project.title} showcase item`} data-cursor="project">
          <div className="showcase-card-bar"><span>{project.index}</span><span>{project.category}</span><span>{frameLabels[project.ratio]}</span></div>
          <div className="showcase-card-stage"><ProjectArtwork project={project} /></div>
          <div className="showcase-card-info">
            <div><h3>{project.title}</h3><span>{project.industry} · {project.year}</span></div>
            <p>{project.summary}</p>
            <div className="showcase-card-foot"><span>{project.services.slice(0, 2).join(" + ")}</span><span>Open item <ArrowUpRight aria-hidden="true" /></span></div>
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
