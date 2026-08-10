import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import { ProjectMedia } from "@/components/ProjectMedia";
import { listPortfolioProjects } from "@/db/repository";
import {
  galleryItemMatchesShowcaseCategory,
  getShowcaseCategory,
  projectMatchesShowcaseCategory,
  projects,
  showcaseCategories,
  type Project,
  type ProjectGalleryItem,
} from "@/lib/portfolio";

export const dynamic = "force-dynamic";

type CategoryParams = Promise<{ "category-slug": string }>;

type CategoryWork = {
  id: string;
  project: Project;
  media: ProjectGalleryItem | null;
  title: string;
  client: string;
  industry: string;
  year: number;
};

export function generateStaticParams() {
  return showcaseCategories.map((category) => ({ "category-slug": category.value }));
}

export async function generateMetadata({ params }: { params: CategoryParams }): Promise<Metadata> {
  const { "category-slug": slug } = await params;
  const category = getShowcaseCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.label + " Portfolio",
    description: category.description + " Explore selected work by Orko Biswas.",
    alternates: { canonical: "/work/category/" + category.value },
  };
}

function collectCategoryWork(liveProjects: Project[], categoryValue: (typeof showcaseCategories)[number]["value"]) {
  return liveProjects.flatMap((project) => {
    const works: CategoryWork[] = [];
    const includeCover = projectMatchesShowcaseCategory(project, categoryValue);
    if (includeCover) {
      works.push({
        id: project.id + "-cover",
        project,
        media: null,
        title: project.title,
        client: project.client,
        industry: project.industry,
        year: project.year,
      });
    }
    for (const item of project.gallery ?? []) {
      if (!galleryItemMatchesShowcaseCategory(item, categoryValue)) continue;
      if (includeCover && project.mediaUrl && item.url === project.mediaUrl) continue;
      works.push({
        id: project.id + "-" + item.id,
        project,
        media: item,
        title: item.title || project.title,
        client: item.client || project.client,
        industry: item.industry || project.industry,
        year: item.year ?? project.year,
      });
    }
    return works;
  });
}

export default async function WorkCategoryPage({ params }: { params: CategoryParams }) {
  const { "category-slug": slug } = await params;
  const category = getShowcaseCategory(slug);
  if (!category) notFound();
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  const works = collectCategoryWork(liveProjects, category.value);
  const projectCount = new Set(works.map((item) => item.project.id)).size;
  const categoryIndex = showcaseCategories.findIndex((item) => item.value === category.value);

  return (
    <main className="category-portfolio-page">
      <header className="category-portfolio-hero section-shell">
        <div className="category-portfolio-kicker">
          <Link className="text-link" href="/work"><ArrowLeft aria-hidden="true" /> All work</Link>
          <span>Category {String(categoryIndex + 1).padStart(2, "0")} / {String(showcaseCategories.length).padStart(2, "0")}</span>
        </div>
        <div className="category-portfolio-title">
          <div><p className="eyebrow">Selected work / category</p><h1>{category.label}</h1></div>
          <div><p>{category.description}</p><dl><div><dt>Projects</dt><dd>{String(projectCount).padStart(2, "0")}</dd></div><div><dt>Works</dt><dd>{String(works.length).padStart(2, "0")}</dd></div></dl></div>
        </div>
        <nav className="category-portfolio-nav" aria-label="Work categories">
          {showcaseCategories.map((item, index) => <Link className={item.value === category.value ? "is-active" : ""} href={"/work/category/" + item.value} aria-current={item.value === category.value ? "page" : undefined} key={item.value}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}
        </nav>
      </header>

      <section className="category-work-library section-shell" aria-labelledby="category-work-heading">
        <div className="category-work-head">
          <div><p className="eyebrow">Complete category stack</p><h2 id="category-work-heading">Explore every published piece.</h2></div>
          <p>Project covers and individually categorized uploads are collected here automatically from the owner dashboard.</p>
        </div>
        {works.length ? <div className="category-work-grid">
          {works.map((work, index) => {
            const mediaType = work.media?.type ?? (work.project.mediaType === "image" || work.project.mediaType === "video" ? work.project.mediaType : null);
            const mediaUrl = work.media?.url ?? work.project.mediaUrl;
            const mediaAlt = work.media?.alt || work.project.mediaAlt || work.title + " portfolio work";
            return <article className={"category-work-card ratio-" + work.project.ratio} key={work.id}>
              <div className="category-work-media">
                {mediaType && mediaUrl ? <ProjectMedia url={mediaUrl} type={mediaType} alt={mediaAlt} controls={mediaType === "video"} /> : <ProjectArtwork project={work.project} hideLabels />}
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="category-work-caption">
                <div><h3>{work.title}</h3><p>{work.client} · {work.industry} · {work.year}</p></div>
                <Link href={"/work/" + work.project.slug} aria-label={"Open " + work.project.title + " project"}>View project <ArrowUpRight aria-hidden="true" /></Link>
              </div>
            </article>;
          })}
        </div> : <div className="category-work-empty"><p className="eyebrow">Category ready</p><h2>No published work is assigned yet.</h2><p>New project covers and gallery uploads assigned to {category.label} will appear here automatically.</p><Link className="button button-dark" href="/work">Browse all work <ArrowRight aria-hidden="true" /></Link></div>}
      </section>

      <CtaBand title={<>Need this kind<br />of visual work?</>} copy={"Tell me what you liked in the " + category.label + " collection and what you want to create."} />
    </main>
  );
}
