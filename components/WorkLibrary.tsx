"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { deriveShowcaseCategories, filterProjects, workDisciplines, type Project, type WorkDiscipline } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ProjectCard";

gsap.registerPlugin(Flip);

type WorkSort = "newest" | "oldest" | "az";
type InitialWorkFilters = { query?: string; discipline?: WorkDiscipline | "All"; category?: string; industry?: string; year?: string; sort?: WorkSort };

export function WorkLibrary({ projects, initialFilters = {} }: { projects: Project[]; initialFilters?: InitialWorkFilters }) {
  const showcaseCategories = useMemo(() => deriveShowcaseCategories(projects), [projects]);
  const categoryValues = useMemo(() => ["All", ...showcaseCategories.map((item) => item.value)], [showcaseCategories]);
  const industries = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => project.industry)))], [projects]);
  const years = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => String(project.year)))).sort().reverse()], [projects]);
  const root = useRef<HTMLDivElement>(null);
  const pendingFlip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [discipline, setDiscipline] = useState<WorkDiscipline | "All">(initialFilters.discipline ?? "All");
  const [category, setCategory] = useState(categoryValues.includes(initialFilters.category ?? "") ? initialFilters.category! : "All");
  const [industry, setIndustry] = useState(industries.includes(initialFilters.industry ?? "") ? initialFilters.industry! : "All");
  const [year, setYear] = useState(years.includes(initialFilters.year ?? "") ? initialFilters.year! : "All");
  const [sort, setSort] = useState<WorkSort>(initialFilters.sort ?? "newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    const filtered = filterProjects(projects, { query, discipline, category, industry, year });
    return [...filtered].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "oldest") return a.year - b.year;
      return b.year - a.year;
    });
  }, [projects, query, discipline, category, industry, year, sort]);
  const isFiltered = query || discipline !== "All" || category !== "All" || industry !== "All" || year !== "All" || sort !== "newest";

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (discipline !== "All") params.set("discipline", discipline);
    if (category !== "All") params.set("category", category);
    if (industry !== "All") params.set("industry", industry);
    if (year !== "All") params.set("year", year);
    if (sort !== "newest") params.set("sort", sort);
    window.history.replaceState(null, "", params.size ? `/work?${params}` : "/work");
  }, [query, discipline, category, industry, year, sort]);

  useLayoutEffect(() => {
    if (!pendingFlip.current || !root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    if (!reduce) Flip.from(pendingFlip.current, { duration: 0.55, ease: "power3.inOut", absolute: true, stagger: 0.02 });
    pendingFlip.current = null;
  }, [visible]);

  function changeFilter(update: () => void) {
    if (root.current) pendingFlip.current = Flip.getState(root.current.querySelectorAll("[data-project-card]"));
    update();
  }

  function clearFilters() {
    changeFilter(() => {
      setQuery("");
      setDiscipline("All");
      setCategory("All");
      setIndustry("All");
      setYear("All");
      setSort("newest");
    });
  }

  return (
    <div className="work-library">
      <header className="work-archive-masthead agency-work-hero">
        <div className="agency-work-topbar">
          <p><span aria-hidden="true" /> All projects</p>
          <p>Orko Biswas / Visual designer</p>
        </div>
        <div className="agency-work-main">
          <div className="agency-work-heading">
            <p className="agency-work-kicker">Design / Motion / Video</p>
            <h1 id="work-archive-title">
              <span className="agency-work-title-line"><span data-hero-line>Creative work.</span></span>
              <span className="agency-work-title-line"><span data-hero-line>Built to <strong>connect.</strong></span></span>
            </h1>
          </div>
          <div className="agency-work-summary" data-reveal>
            <p>A growing library of brand, campaign, motion, and video work. Use the tools below to find the projects that match your goals.</p>
            <dl>
              <div><dt>Projects</dt><dd>{String(projects.length).padStart(2, "0")}</dd></div>
              <div><dt>Categories</dt><dd>{String(showcaseCategories.length).padStart(2, "0")}</dd></div>
            </dl>
          </div>
        </div>
        <div className="agency-work-capabilities" aria-label="Creative areas">
          {workDisciplines.map((item, index) => <span key={item.value}><i>{String(index + 1).padStart(2, "0")}</i>{item.label}</span>)}
        </div>
      </header>

      <div className="work-archive-controls" aria-label="Project search and display options">
        <label className="search-field archive-search-field" htmlFor="work-search"><Search aria-hidden="true" /><span className="sr-only">Search work</span><input id="work-search" type="search" value={query} placeholder="Search projects…" onChange={(event) => changeFilter(() => setQuery(event.target.value))} /></label>
        <label className="work-sort-field"><span>Sort by</span><select value={sort} onChange={(event) => changeFilter(() => setSort(event.target.value as WorkSort))}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="az">A to Z</option></select></label>
        <button className="filter-toggle" type="button" aria-expanded={filtersOpen} aria-controls="advanced-work-filters" onClick={() => setFiltersOpen((value) => !value)}><SlidersHorizontal aria-hidden="true" /> Advanced filters {isFiltered && <span />}</button>
      </div>

      <div className={`filter-panel ${filtersOpen ? "is-open" : ""}`} id="advanced-work-filters">
        <div><p>Type</p><div className="filter-options"><button type="button" aria-pressed={discipline === "All"} onClick={() => changeFilter(() => setDiscipline("All"))}>All work</button>{workDisciplines.map((item) => <button type="button" key={item.value} aria-pressed={discipline === item.value} onClick={() => changeFilter(() => setDiscipline(item.value))}>{item.label}</button>)}</div></div>
        {showcaseCategories.length > 0 && <div><p>Category</p><div className="filter-options"><button type="button" aria-pressed={category === "All"} onClick={() => changeFilter(() => setCategory("All"))}>All categories</button>{showcaseCategories.map((item) => <button type="button" key={item.value} aria-pressed={category === item.value} onClick={() => changeFilter(() => setCategory(item.value))}>{item.label}</button>)}</div></div>}
        <div><p>Industry</p><div className="filter-options">{industries.map((item) => <button type="button" key={item} aria-pressed={industry === item} onClick={() => changeFilter(() => setIndustry(item))}>{item}</button>)}</div></div>
        <div><p>Year</p><div className="filter-options">{years.map((item) => <button type="button" key={item} aria-pressed={year === item} onClick={() => changeFilter(() => setYear(item))}>{item}</button>)}</div></div>
      </div>

      <div className="library-count"><p><span>{String(visible.length).padStart(2, "0")}</span> projects in view</p>{isFiltered && <button type="button" onClick={clearFilters}>Clear filters <X aria-hidden="true" /></button>}</div>

      {visible.length ? (
        <div ref={root} className="project-library is-grid" aria-live="polite">
          {visible.map((project, index) => <ProjectCard project={project} key={project.id} priority={index < 4} clean />)}
        </div>
      ) : (
        <div className="empty-state" role="status"><p className="eyebrow">{projects.length ? "No matching frames" : "New library"}</p><h2>{projects.length ? "The archive has more directions." : "New projects are coming soon."}</h2><p>{projects.length ? "Try a broader phrase or reset the filters to see the full library." : "Orko is preparing a fresh collection of selected work."}</p>{projects.length > 0 && <button className="button button-light" type="button" onClick={clearFilters}>Reset the archive</button>}</div>
      )}
    </div>
  );
}
