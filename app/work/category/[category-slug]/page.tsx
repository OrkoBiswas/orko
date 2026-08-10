import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import { ProjectMedia } from "@/components/ProjectMedia";
import { listPortfolioProjects } from "@/db/repository";
import { deriveShowcaseCategories, getShowcaseCategory, projectMatchesShowcaseCategory, projects, type Project } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

type CategoryParams = Promise<{ "category-slug": string }>;

export function generateStaticParams() {
  return [];
}

function collectCategoryProjects(liveProjects: Project[], categoryValue: string) {
  return liveProjects.filter((project) => projectMatchesShowcaseCategory(project, categoryValue));
}

export async function generateMetadata({ params }: { params: CategoryParams }): Promise<Metadata> {
  const { "category-slug": slug } = await params;
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  const category = getShowcaseCategory(slug, deriveShowcaseCategories(liveProjects));
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.label} Portfolio`,
    description: `${category.description} Explore selected work by Orko Biswas.`,
    alternates: { canonical: `/work/category/${category.value}` },
  };
}

export default async function WorkCategoryPage({ params }: { params: CategoryParams }) {
  const { "category-slug": slug } = await params;
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  const showcaseCategories = deriveShowcaseCategories(liveProjects);
  const category = getShowcaseCategory(slug, showcaseCategories);
  if (!category) notFound();
  const categoryProjects = collectCategoryProjects(liveProjects, category.value);
  const categoryIndex = showcaseCategories.findIndex((item) => item.value === category.value);

  return <main className="category-portfolio-page">
    <header className="category-portfolio-hero section-shell">
      <div className="category-portfolio-kicker"><Link className="text-link" href="/work"><ArrowLeft aria-hidden="true" /> All work</Link><span>Category {String(categoryIndex + 1).padStart(2, "0")} / {String(showcaseCategories.length).padStart(2, "0")}</span></div>
      <div className="category-portfolio-title"><div><p className="eyebrow">Selected work / category</p><h1>{category.label}</h1></div><div><p>{category.description}</p><dl><div><dt>Projects</dt><dd>{String(categoryProjects.length).padStart(2, "0")}</dd></div><div><dt>Format</dt><dd>Full stories</dd></div></dl></div></div>
      <nav className="category-portfolio-nav" aria-label="Work categories">{showcaseCategories.map((item, index) => <Link className={item.value === category.value ? "is-active" : ""} href={`/work/category/${item.value}`} aria-current={item.value === category.value ? "page" : undefined} key={item.value}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}</nav>
    </header>

    <section className="category-work-library section-shell" aria-labelledby="category-work-heading">
      <div className="category-work-head"><div><p className="eyebrow">Complete category stack</p><h2 id="category-work-heading">Choose a project to explore.</h2></div><p>Each thumbnail opens one complete presentation with its own images, video, text, grids, links, and downloadable assets.</p></div>
      <div className="category-work-grid">{categoryProjects.map((project, index) => {
        const mediaType = project.mediaType === "image" || project.mediaType === "video" ? project.mediaType : null;
        const mediaUrl = project.mediaUrl;
        const mediaAlt = project.mediaAlt || `${project.title} category thumbnail`;
        return <article className={`category-work-card ratio-${project.ratio}`} key={project.id}>
          <Link className="category-work-card-link" href={`/work/${project.slug}`} aria-label={`Open ${project.title} project`}>
            <div className="category-work-media">{mediaType && mediaUrl ? <ProjectMedia url={mediaUrl} type={mediaType} alt={mediaAlt} /> : <ProjectArtwork project={project} hideLabels />}<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
            <div className="category-work-caption"><div><h3>{project.title}</h3><p>{project.client} · {project.industry} · {project.year}</p></div><span className="category-work-open">View project <ArrowUpRight aria-hidden="true" /></span></div>
          </Link>
        </article>;
      })}</div>
    </section>

    <CtaBand title={<>Need this kind<br />of visual work?</>} copy={`Tell me what you liked in the ${category.label} collection and what you want to create.`} />
  </main>;
}
