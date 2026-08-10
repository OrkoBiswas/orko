import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import type { Project, ShowcaseCategory as ShowcaseCategoryValue } from "@/lib/portfolio";

export type ShowcaseCategory = {
  value: ShowcaseCategoryValue;
  label: string;
  description: string;
  cover: Project;
  workCount: number;
};

export function ShowcaseGrid({ categories }: { categories: ShowcaseCategory[] }) {
  return (
    <div className="behance-category-grid" aria-label="Portfolio categories">
      {categories.map((category, index) => (
        <article className="behance-category-card" data-project-card data-priority={index < 3 || undefined} key={category.value}>
          <Link href={`/work/category/${category.value}`} aria-label={`Explore all ${category.label} work`} data-cursor="project">
            <div className={`behance-category-cover ratio-${category.cover.ratio}`}>
              <ProjectArtwork project={category.cover} hideLabels />
            </div>
            <div className="behance-category-caption">
              <div><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{category.label}</h3></div>
              <p>{category.description}</p>
              <div className="behance-category-meta"><span>{String(category.workCount).padStart(2, "0")} works</span><strong>View category <ArrowUpRight aria-hidden="true" /></strong></div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
