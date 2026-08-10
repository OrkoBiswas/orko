import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
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
      <header className="work-intro section-shell">
        <div className="work-intro-top"><p className="eyebrow"><span>01</span>Selected work</p><span>{String(liveProjects.length).padStart(2, "0")} published projects</span></div>
        <div className="work-intro-main">
          <h1>Work made to<br /><em>earn attention.</em></h1>
          <div><p>A focused collection of visual design, motion, video, and digital work. Choose a category or browse the complete archive.</p><div className="work-intro-actions"><a className="button button-accent" href="#work-library">Browse projects <ArrowDown aria-hidden="true" /></a><Link className="text-link" href="/start-a-project">Discuss your project <ArrowUpRight aria-hidden="true" /></Link></div></div>
        </div>
        <div className="work-intro-foot"><span>Clear ideas</span><span>Strong visual direction</span><span>Useful final work</span></div>
      </header>

      {categories.length > 0 && <nav className="work-category-index section-shell" aria-label="Browse work by category">
        <div className="work-category-index-head"><p className="eyebrow">Explore by category</p><p>Start with the kind of work you need.</p></div>
        <div className="work-category-index-links">{categories.map((category, index) => {
          const count = liveProjects.filter((project) => projectMatchesShowcaseCategory(project, category.value)).length;
          return <Link href={`/work/category/${category.value}`} key={category.value}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.label}</strong><small>{String(count).padStart(2, "0")} projects</small><ArrowRight aria-hidden="true" /></Link>;
        })}</div>
      </nav>}

      <section id="work-library" className="work-library-section section-shell" aria-label="Complete project archive"><WorkLibrary projects={liveProjects} initialFilters={initialFilters} /></section>
    </div>
  );
}
