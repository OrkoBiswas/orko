import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import type { Project, ShowcaseCategory as ShowcaseCategoryValue } from "@/lib/portfolio";

export type ShowcaseCategory = {
  value: ShowcaseCategoryValue;
  label: string;
  cover: Project;
};

export function ShowcaseGrid({ categories }: { categories: ShowcaseCategory[] }) {
  return (
    <div className="showcase-grid showcase-category-runway" aria-label="Portfolio categories">
      {categories.map((category, index) => (
        <article className={`project-card showcase-piece showcase-category-piece ratio-${category.cover.ratio}`} data-project-card data-priority={index === 0 || undefined} key={category.value}>
          <Link href={`/work?category=${category.value}`} aria-label={`Explore all ${category.label} work`} data-cursor="project">
            <div className="showcase-piece-index" aria-hidden="true">
              <span>Category</span>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <i />
            </div>
            <div className="showcase-piece-media">
              <ProjectArtwork project={category.cover} hideLabels />
            </div>
            <div className="showcase-piece-info showcase-category-info">
              <div className="showcase-piece-heading">
                <span>Creative archive</span>
                <h3>{category.label}</h3>
              </div>
              <div className="showcase-piece-action">
                <span>Selected work in this category</span>
                <strong>Explore <ArrowUpRight aria-hidden="true" /></strong>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
