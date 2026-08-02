"use client";

import { useLayoutEffect, useRef } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/portfolio";

export function ShowcaseGrid({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = root.current;
    if (!grid) return;

    let frame = 0;
    const layout = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const styles = window.getComputedStyle(grid);
        const row = Number.parseFloat(styles.gridAutoRows) || 8;
        const gap = Number.parseFloat(styles.rowGap) || 1;
        grid.querySelectorAll<HTMLElement>("[data-project-card]").forEach((card) => {
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
  }, [projects]);

  return <div className="featured-grid" ref={root}>{projects.map((project, index) => <ProjectCard project={project} key={project.id} priority={index < 2} />)}</div>;
}
