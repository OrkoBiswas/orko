import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categorySlug, projects } from "@/lib/portfolio";
import { listPortfolioProjects } from "@/db/repository";
import { CtaBand } from "@/components/CtaBand";
import { ProjectPresentation } from "@/components/ProjectPresentation";

export function generateStaticParams() {
  return projects.map((project) => ({ "project-slug": project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "project-slug": string }> }): Promise<Metadata> {
  const { "project-slug": slug } = await params;
  const project = (await listPortfolioProjects(projects, { publishedOnly: true })).find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  const images = project.mediaType === "image" && project.mediaUrl ? [{ url: project.mediaUrl, alt: project.mediaAlt || project.title }] : undefined;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: "article", title: `${project.title} — Orko Biswas`, description: project.summary, url: `/work/${project.slug}`, images },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary, images: images?.map((image) => image.url) },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ "project-slug": string }> }) {
  const { "project-slug": slug } = await params;
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  const project = liveProjects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = liveProjects.findIndex((item) => item.id === project.id);
  const next = liveProjects[(index + 1) % liveProjects.length];
  const assignedCategory = categorySlug(project.category);
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: { "@type": "Person", name: "Orko Biswas" },
    dateCreated: String(project.year),
    genre: project.category,
    about: project.industry,
    image: project.mediaType === "image" ? project.mediaUrl || undefined : undefined,
    video: project.mediaType === "video" && project.mediaUrl ? { "@type": "VideoObject", name: project.title, description: project.mediaAlt || project.summary, contentUrl: project.mediaUrl } : undefined,
  };

  return <article className="project-detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema).replaceAll("<", "\\u003c") }} />
    <header className="case-hero project-intro">
      <div className="section-shell">
        <div className="case-hero-head"><Link className="text-link" href={`/work/category/${assignedCategory}`}><ArrowLeft aria-hidden="true" /> Back to category</Link><p className="eyebrow">Project / {project.index}</p></div>
        <h1>{project.title}</h1>
        <p className="project-intro-summary">{project.summary}</p>
        <div className="case-hero-meta"><div><span>Category</span><p>{project.category}</p></div><div><span>Client</span><p>{project.client}</p></div><div><span>Industry</span><p>{project.industry}</p></div><div><span>Year</span><p>{project.year}</p></div></div>
      </div>
    </header>
    <ProjectPresentation project={project} />
    <CtaBand title={<>Want something<br />similar?</>} />
    <Link className="next-project" href={`/work/${next.slug}`}><span>Next project / {next.index}</span><strong>{next.title}<ArrowRight aria-hidden="true" /></strong></Link>
  </article>;
}
