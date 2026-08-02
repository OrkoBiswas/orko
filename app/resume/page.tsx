import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ResumeActions } from "@/components/ResumeActions";
import { getSiteContent } from "@/db/repository";

export const metadata: Metadata = { title: "Résumé", description: "Professional résumé for Orko Biswas." };
export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const content = await getSiteContent();
  return <>
    <PageHero index="08" eyebrow="Résumé" title={<>My skills and<br /><em>creative work.</em></>} intro="A simple overview of my services, tools, and working style. You can save this page as a PDF." aside={<ResumeActions />} />
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Profile</p><div className="editorial-copy"><h2>{content.title}</h2><p>{content.biography}</p></div></div></section>
    <section className="editorial-section dark-section"><div className="editorial-grid section-shell"><p className="eyebrow">Core skills</p><div className="editorial-copy"><div className="split-cards">{[["Video editing","Brand videos, promotional edits, interviews, YouTube videos, shorts, color, sound, and captions."],["2D motion","Animated text, explainers, titles, logos, social loops, and motion packages."],["Graphic design","Campaign visuals, posters, thumbnails, presentations, and social media layouts."],["Collaboration","Clear planning, creative direction, review stages, multiple formats, and organized delivery."]].map(([title,copy]) => <article key={title}><span>Skill</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></div></section>
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Tools</p><div className="editorial-copy"><div className="skills-cloud">{["Adobe Premiere Pro","After Effects","Photoshop","Illustrator","DaVinci Resolve","Figma"].map((item) => <span key={item}>{item}</span>)}</div><p style={{ marginTop: 40 }}>Location: {content.location}<br />Timezone: {content.timezone}<br />Availability: {content.availability}</p></div></div></section>
  </>;
}
