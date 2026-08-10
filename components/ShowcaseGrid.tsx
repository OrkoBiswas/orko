import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import { ProjectMedia } from "@/components/ProjectMedia";
import type { Project, ShowcaseCategoryDefinition } from "@/lib/portfolio";
import type { CategoryThumbnail } from "@/lib/category-content";

export type ShowcaseCategory = ShowcaseCategoryDefinition & {
  cover: Project;
  thumbnail?: CategoryThumbnail;
  workCount: number;
};

export function ShowcaseGrid({ categories }: { categories: ShowcaseCategory[] }) {
  return (
    <div className="behance-category-grid" aria-label="Portfolio categories">
      {categories.map((category, index) => (
        <article className="behance-category-card" data-project-card data-priority={index < 3 || undefined} key={category.value}>
          <Link href={`/work/category/${category.value}`} aria-label={`Explore all ${category.label} work`} data-cursor="project">
            <div className={`behance-category-cover ratio-${category.thumbnail?.ratio ?? category.cover.ratio}`}>
              {category.thumbnail ? <ProjectMedia url={category.thumbnail.mediaUrl} type={category.thumbnail.mediaType} alt={category.thumbnail.mediaAlt} /> : <ProjectArtwork project={category.cover} hideLabels ignoreMedia />}
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
