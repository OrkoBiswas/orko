"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { filterProjects, type Project } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ProjectCard";

gsap.registerPlugin(Flip);

export function WorkLibrary({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const industries = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => project.industry)))], [projects]);
  const years = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => String(project.year)))).sort().reverse()], [projects]);
  const root = useRef<HTMLDivElement>(null);
  const pendingFlip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [year, setYear] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => filterProjects(projects, { query, category, industry, year }), [projects, query, category, industry, year]);
  const isFiltered = query || category !== "All" || industry !== "All" || year !== "All";

  useLayoutEffect(() => {
    if (!pendingFlip.current || !root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    if (!reduce) Flip.from(pendingFlip.current, { duration: 0.55, ease: "power3.inOut", absolute: true, stagger: 0.02 });
    pendingFlip.current = null;
  }, [visible]);

  useLayoutEffect(() => {
    const grid = root.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-project-card]"));
    if (view !== "grid") {
      cards.forEach((card) => { card.style.gridRowEnd = ""; });
      return;
    }

    let frame = 0;
    const layout = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const styles = window.getComputedStyle(grid);
        const row = Number.parseFloat(styles.gridAutoRows) || 8;
        const gap = Number.parseFloat(styles.rowGap) || 1;
        cards.forEach((card) => {
          const content = card.querySelector<HTMLElement>("a");
          if (!content) return;
          const span = Math.max(1, Math.ceil((content.scrollHeight + gap) / (row + gap)));
          const next = `span ${span}`;
          if (card.style.gridRowEnd !== next) card.style.gridRowEnd = next;
        });
      });
    };

    const observer = new ResizeObserver(layout);
    observer.observe(grid);
    layout();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [visible, view]);

  function changeFilter(update: () => void) {
    if (root.current) pendingFlip.current = Flip.getState(root.current.querySelectorAll("[data-project-card]"));
    update();
    window.requestAnimationFrame(() => {
      const params = new URLSearchParams();
      const nextQuery = (document.querySelector<HTMLInputElement>("#work-search")?.value ?? "").trim();
      if (nextQuery) params.set("q", nextQuery);
      const url = params.size ? `/work?${params}` : "/work";
      window.history.replaceState(null, "", url);
    });
  }

  function clearFilters() {
    changeFilter(() => {
      setQuery("");
      setCategory("All");
      setIndustry("All");
      setYear("All");
    });
  }

  return (
    <div className="work-library">
      <div className="work-toolbar">
        <label className="search-field" htmlFor="work-search"><Search aria-hidden="true" /><span className="sr-only">Search work</span><input id="work-search" type="search" value={query} placeholder="Search title, format, industry…" onChange={(event) => changeFilter(() => setQuery(event.target.value))} /></label>
        <button className="filter-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}><SlidersHorizontal aria-hidden="true" /> Filters {isFiltered && <span />}</button>
        <div className="view-toggle" aria-label="Project view">
          <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 aria-hidden="true" /></button>
          <button type="button" aria-label="Editorial list view" aria-pressed={view === "list"} onClick={() => setView("list")}><List aria-hidden="true" /></button>
        </div>
      </div>

      <div className={`filter-panel ${filtersOpen ? "is-open" : ""}`}>
        <div><p>Category</p><div className="filter-options">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => changeFilter(() => setCategory(item))}>{item}</button>)}</div></div>
        <div><p>Industry</p><div className="filter-options">{industries.map((item) => <button type="button" key={item} aria-pressed={industry === item} onClick={() => changeFilter(() => setIndustry(item))}>{item}</button>)}</div></div>
        <div><p>Year</p><div className="filter-options">{years.map((item) => <button type="button" key={item} aria-pressed={year === item} onClick={() => changeFilter(() => setYear(item))}>{item}</button>)}</div></div>
      </div>

      <div className="library-count"><p><span>{String(visible.length).padStart(2, "0")}</span> projects in view</p>{isFiltered && <button type="button" onClick={clearFilters}>Clear filters <X aria-hidden="true" /></button>}</div>

      {visible.length ? (
        <div ref={root} className={`project-library ${view === "list" ? "is-list" : "is-grid"}`} aria-live="polite">
          {visible.map((project, index) => <ProjectCard project={project} key={project.id} priority={index < 4} />)}
        </div>
      ) : (
        <div className="empty-state" role="status"><p className="eyebrow">No matching frames</p><h2>The archive has more directions.</h2><p>Try a broader phrase or reset the filters to see the full library.</p><button className="button button-light" type="button" onClick={clearFilters}>Reset the archive</button></div>
      )}
    </div>
  );
}
