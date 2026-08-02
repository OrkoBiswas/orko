import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WorkLibrary } from "@/components/WorkLibrary";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Work Archive",
  description: "Explore Orko Biswas's growing archive of video editing, motion design, campaign, social, poster, and visual system work.",
};

export default function WorkPage() {
  return (
    <div className="work-page">
      <PageHero index="01" eyebrow="The work archive" title={<>A library of<br /><em>moving ideas.</em></>} intro="Not a highlight strip. A deep, filterable archive of edits, motion studies, campaign systems, and visual experiments—each opening into the thinking behind it." aside={<span className="eyebrow">12 projects / 10 directions</span>} />
      <section className="section-shell"><WorkLibrary /></section>
      <CtaBand title={<>Found a direction<br />worth building on?</>} copy="Mention the project or visual language that caught your eye. It makes the first creative conversation much more useful." />
    </div>
  );
}

