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
      <PageHero index="01" eyebrow="The work archive" title={<>A library of<br /><em>moving ideas.</em></>} intro="Not a highlight strip. A deep, filterable archive of edits, motion studies, campaign systems, and visual experiments—each opening into the thinking behind it." aside={<span className="eyebrow">{liveProjects.length} projects / many directions</span>} />
      <section className="section-shell"><WorkLibrary projects={liveProjects} /></section>
      <CtaBand title={<>Found a direction<br />worth building on?</>} copy="Mention the project or visual language that caught your eye. It makes the first creative conversation much more useful." />
    </div>
  );
}
