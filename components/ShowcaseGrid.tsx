import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/portfolio";

export function ShowcaseGrid({ projects }: { projects: Project[] }) {
  const rows = Array.from({ length: Math.ceil(projects.length / 2) }, (_, index) => projects.slice(index * 2, index * 2 + 2));

  return (
    <div className="showcase-grid">
      {rows.map((row, rowIndex) => (
        <div className={`showcase-row showcase-row-${rowIndex + 1}`} key={row.map((project) => project.id).join("-")}>
          {row.map((project, projectIndex) => (
            <ProjectCard project={project} key={project.id} priority={rowIndex === 0 && projectIndex === 0} variant="showcase" />
          ))}
        </div>
      ))}
    </div>
  );
}
