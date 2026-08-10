import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkLibrary } from "@/components/WorkLibrary";
import { listPortfolioProjects } from "@/db/repository";
import { deriveShowcaseCategories, projectMatchesShowcaseCategory, projects, workDisciplines, type WorkDiscipline } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Work Archive",
  description: "Explore Orko Biswas's growing archive of video editing, motion design, campaign, social, poster, and visual system work.",
};

export const dynamic = "force-dynamic";

type WorkSearchParams = Record<string, string | string[] | undefined>;
function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }

export default async function WorkPage({ searchParams }: { searchParams: Promise<WorkSearchParams> }) {
  const requested = await searchParams;
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  const categories = deriveShowcaseCategories(liveProjects);
  const requestedDiscipline = first(requested.discipline);
  const discipline: WorkDiscipline | "All" = workDisciplines.some((item) => item.value === requestedDiscipline) ? requestedDiscipline as WorkDiscipline : "All";
  const initialFilters = { query: first(requested.q), discipline, category: first(requested.category), industry: first(requested.industry), year: first(requested.year) };
  return (
    <div className="work-page">
      {categories.length > 0 && <nav className="work-gallery-categories section-shell" aria-label="Browse work by category" data-work-category-sequence>
        <span className="work-category-orbit" aria-hidden="true"><i /><i /></span>
        <div className="work-gallery-categories-head">
          <div className="work-category-head-meta">
            <p className="eyebrow">Browse by category</p>
            <span>{String(categories.length).padStart(2, "0")} collections</span>
          </div>
          <h2 aria-label="Find the work you need.">
            <span className="work-category-type work-category-type-find"><span data-work-category-line>Find the</span></span>
            <span className="work-category-type work-category-type-work"><span data-work-category-line><em>work</em></span></span>
            <span className="work-category-type work-category-type-need"><span data-work-category-line>you need.</span></span>
          </h2>
          <div className="work-category-intro" data-work-category-intro>
            <span aria-hidden="true" />
            <p>Each category opens a complete collection of related projects.</p>
          </div>
        </div>
        <div className="work-gallery-category-list" data-work-category-list>{categories.map((category, index) => {
          const count = liveProjects.filter((project) => projectMatchesShowcaseCategory(project, category.value)).length;
          return <Link href={`/work/category/${category.value}`} key={category.value} data-work-category-item><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.label}</strong><small aria-label={`${count} ${count === 1 ? "project" : "projects"}`}>{String(count).padStart(2, "0")}</small><ArrowUpRight aria-hidden="true" /></Link>;
        })}</div>
      </nav>}

      <section id="project-library" className="work-collection section-shell" aria-label="Complete project archive"><WorkLibrary projects={liveProjects} initialFilters={initialFilters} /></section>
    </div>
  );
}
