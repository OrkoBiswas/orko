import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { ProjectArtwork } from "@/components/ProjectArtwork";

export function ProjectCard({ project, priority = false, clean = false }: { project: Project; priority?: boolean; clean?: boolean }) {
  return (
    <article className={`project-card ratio-${project.ratio} ${clean ? "work-project-card" : ""}`} data-project-card data-priority={priority || undefined}>
      <Link href={`/work/${project.slug}`} aria-label={`Open ${project.title} showcase`} data-cursor="project">
        {clean ? <>
          <div className="work-card-media"><ProjectArtwork project={project} hideLabels /></div>
          <div className="work-card-info">
            <div className="work-card-index"><span>{project.category}</span><small>{project.index}</small></div>
            <h3>{project.title}</h3>
            <div className="work-card-meta"><span>{project.client} · {project.industry}</span><span>{project.year}<ArrowUpRight aria-hidden="true" /></span></div>
          </div>
        </> : <>
          <ProjectArtwork project={project} />
          <div className="project-card-meta"><div><p>{project.title}</p><span>{project.category} - {project.industry}</span></div><div><span>{project.year}</span><ArrowUpRight aria-hidden="true" /></div></div>
        </>}
      </Link>
    </article>
  );
}
