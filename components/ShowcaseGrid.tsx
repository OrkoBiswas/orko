import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import type { Project, WorkDiscipline } from "@/lib/portfolio";

export type ShowcaseCategory = {
  value: WorkDiscipline;
  label: string;
  cover: Project;
};

export function ShowcaseGrid({ categories }: { categories: ShowcaseCategory[] }) {
  return (
    <div className="showcase-grid showcase-category-grid" aria-label="Portfolio categories">
      {categories.map((category, index) => (
        <article className="showcase-category-card" data-project-card data-priority={index === 0 || undefined} key={category.value}>
          <Link href={`/work?discipline=${category.value}`} aria-label={`Explore all ${category.label} work`} data-cursor="project">
            <div className="showcase-category-cover">
              <ProjectArtwork project={category.cover} hideLabels />
            </div>
            <div className="showcase-category-caption">
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{category.label}</h3>
              <ArrowUpRight aria-hidden="true" />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
