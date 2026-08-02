import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WorkLibrary } from "@/components/WorkLibrary";
import { CtaBand } from "@/components/CtaBand";
import { listPortfolioProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Work Archive",
  description: "Explore Orko Biswas's growing archive of video editing, motion design, campaign, social, poster, and visual system work.",
};

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const liveProjects = await listPortfolioProjects(projects, { publishedOnly: true });
  return (
    <div className="work-page">
      <PageHero index="01" eyebrow="Work archive" title={<>Video, motion,<br />and <em>design work.</em></>} intro="Browse video edits, motion graphics, posters, social content, campaign visuals, and creative bundles. Use the filters to find the work you need." aside={<span className="eyebrow">{liveProjects.length} projects / many formats</span>} />
      <section className="section-shell"><WorkLibrary projects={liveProjects} /></section>
      <CtaBand title={<>Found something<br />you like?</>} copy="Tell me which project, style, or format caught your attention. It will help us start with a clear direction." />
    </div>
  );
}
