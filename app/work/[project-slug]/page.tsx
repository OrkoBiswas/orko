import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/portfolio";
import { listPortfolioProjects } from "@/db/repository";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import { CtaBand } from "@/components/CtaBand";

export function generateStaticParams() { return projects.map((project) => ({ "project-slug": project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ "project-slug": string }> }): Promise<Metadata> {
  const { "project-slug": slug } = await params;
  const project = (await listPortfolioProjects(projects, { publishedOnly: true })).find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary, openGraph: { title: `${project.title} — Orko Biswas`, description: project.summary } };
}

export default async function ProjectPage({ params }: { params: Promise<{ "project-slug": string }> }) {
  const { "project-slug": slug } = await params;
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  const project = liveProjects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = liveProjects.findIndex((item) => item.id === project.id);
  const next = liveProjects[(index + 1) % liveProjects.length];
  return (
    <article>
      <header className="case-hero">
        <div className="section-shell">
          <div className="case-hero-head"><Link className="text-link" href="/work"><ArrowLeft aria-hidden="true" /> Back to archive</Link><p className="eyebrow">Case study / {project.index}</p></div>
          <h1>{project.title}</h1>
          <div className="case-hero-meta"><div><span>Category</span><p>{project.category}</p></div><div><span>Client</span><p>{project.client}</p></div><div><span>Industry</span><p>{project.industry}</p></div><div><span>Year</span><p>{project.year}</p></div></div>
        </div>
      </header>
      <div className="case-art"><ProjectArtwork project={project} /></div>
      <section className="case-overview"><div className="section-shell"><div className="case-statement" data-reveal><p>“{project.summary}”</p></div><div className="case-details"><div data-reveal><p className="eyebrow">The challenge</p><h2>Find the real point.</h2><p>{project.challenge}</p></div><div data-reveal><p className="eyebrow">Creative direction</p><h2>Give it one clear rule.</h2><p>{project.concept}</p></div></div></div></section>
      <section className="case-process"><div className="section-shell"><p className="eyebrow">Process / selected stages</p><ol>{project.approach.map((item, itemIndex) => <li key={item}><span>0{itemIndex + 1}</span><h3>{item}</h3></li>)}</ol></div></section>
      <section className="case-delivery"><div className="delivery-grid section-shell"><div><p className="eyebrow">Delivery system</p><h2>One idea.<br />Every required frame.</h2><p>This concept case study demonstrates the intended creative and production approach. Real performance metrics will only be added when verified.</p></div><div><div className="delivery-list">{project.deliverables.map((item) => <p key={item}>↳ {item}</p>)}</div><p className="eyebrow" style={{ marginTop: 40 }}>Tools / {project.tools.join(" · ")}</p><Link className="text-link" href={`/start-a-project?reference=${project.slug}`} style={{ marginTop: 34 }}>Reference this direction <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
      <CtaBand title={<>Want something<br />similar?</>} />
      <Link className="next-project" href={`/work/${next.slug}`}><span>Next project / {next.index}</span><strong>{next.title}<ArrowRight aria-hidden="true" /></strong></Link>
    </article>
  );
}
