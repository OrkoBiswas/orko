import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/portfolio";

export function ShowcaseGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="showcase-grid" aria-label="Selected portfolio work">
      {projects.map((project, index) => (
        <ProjectCard project={project} key={project.id} priority={index === 0} variant="showcase" />
      ))}
    </div>
  );
}
