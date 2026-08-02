import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { ProjectArtwork } from "@/components/ProjectArtwork";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className={`project-card ratio-${project.ratio}`} data-project-card data-priority={priority || undefined}>
      <Link href={`/work/${project.slug}`} aria-label={`View ${project.title} case study`}>
        <ProjectArtwork project={project} />
        <div className="project-card-meta">
          <div><p>{project.title}</p><span>{project.category} · {project.industry}</span></div>
          <div><span>{project.year}</span><ArrowUpRight aria-hidden="true" /></div>
        </div>
      </Link>
    </article>
  );
}

