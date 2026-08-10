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
      {categories.length > 0 && <nav className="work-gallery-categories section-shell" aria-label="Browse work by category">
        <div className="work-gallery-categories-head"><p className="eyebrow">Browse by category</p><h2>Find the work<br />you need.</h2><p>Each category opens a complete collection of related projects.</p></div>
        <div className="work-gallery-category-list">{categories.map((category, index) => {
          const count = liveProjects.filter((project) => projectMatchesShowcaseCategory(project, category.value)).length;
          return <Link href={`/work/category/${category.value}`} key={category.value}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.label}</strong><small>{String(count).padStart(2, "0")}</small><ArrowUpRight aria-hidden="true" /></Link>;
        })}</div>
      </nav>}

      <section id="project-library" className="work-collection section-shell" aria-label="Complete project archive"><WorkLibrary projects={liveProjects} initialFilters={initialFilters} /></section>
    </div>
  );
}
