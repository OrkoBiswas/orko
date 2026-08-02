import type { ReactNode } from "react";

export function PageHero({ index, eyebrow, title, intro, aside }: { index: string; eyebrow: string; title: ReactNode; intro: string; aside?: ReactNode }) {
  return (
    <section className="page-hero section-shell">
      <div className="page-hero-top"><p className="eyebrow"><span>{index}</span>{eyebrow}</p>{aside}</div>
      <h1>{title}</h1>
      <div className="page-hero-bottom"><p>{intro}</p><span aria-hidden="true">↘</span></div>
    </section>
  );
}

