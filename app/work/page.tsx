import type { Metadata } from "next";
import { WorkLibrary } from "@/components/WorkLibrary";
import { listPortfolioProjects } from "@/db/repository";
import { projects, workDisciplines, type WorkDiscipline } from "@/lib/portfolio";

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
  const requestedDiscipline = first(requested.discipline);
  const discipline: WorkDiscipline | "All" = workDisciplines.some((item) => item.value === requestedDiscipline) ? requestedDiscipline as WorkDiscipline : "All";
  const requestedSort = first(requested.sort);
  const sort: "newest" | "oldest" | "az" = requestedSort === "oldest" || requestedSort === "az" ? requestedSort : "newest";
  const initialFilters = { query: first(requested.q), discipline, category: first(requested.category), industry: first(requested.industry), year: first(requested.year), sort };
  return (
    <div className="work-page">
      <section id="project-library" className="work-collection section-shell" aria-labelledby="work-archive-title"><WorkLibrary projects={liveProjects} initialFilters={initialFilters} /></section>
    </div>
  );
}
