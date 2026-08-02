import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ResumeActions } from "@/components/ResumeActions";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Résumé", description: `Professional résumé for ${brand.name}.` };
export default function ResumePage() { return <>
  <PageHero index="08" eyebrow="Résumé" title={<>Multidisciplinary<br /><em>by design.</em></>} intro="A working profile of capabilities and collaboration principles. Save this page as a clean PDF until the final supplied résumé document is published." aside={<ResumeActions />} />
  <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Profile</p><div className="editorial-copy"><h2>{brand.title}</h2><p>{brand.biography}</p></div></div></section>
  <section className="editorial-section dark-section"><div className="editorial-grid section-shell"><p className="eyebrow">Core capabilities</p><div className="editorial-copy"><div className="split-cards">{[["Video editing","Brand films, promotional cuts, interviews, YouTube, short-form and campaign versioning."],["2D motion","Kinetic type, explainers, titles, idents, social loops and repeatable motion systems."],["Graphic design","Campaign visuals, posters, thumbnails, presentation visuals and social systems."],["Collaboration","Discovery, art direction, clear review rounds, multi-format delivery and source handoff when scoped."]].map(([title,copy]) => <article key={title}><span>Capability</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></div></section>
  <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Tools</p><div className="editorial-copy"><div className="skills-cloud">{["Adobe Premiere Pro","After Effects","Photoshop","Illustrator","DaVinci Resolve","Figma"].map((item) => <span key={item}>{item}</span>)}</div><p style={{ marginTop: 40 }}>Location: {brand.location}<br />Timezone: {brand.timezone}<br />Availability: {brand.availability}</p></div></div></section>
  </>; }

