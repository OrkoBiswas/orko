import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { getSiteContent } from "@/db/repository";

export const metadata: Metadata = { title: "About", description: "About Orko Biswas, a video editor, motion designer, and graphic designer." };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  return <>
    <PageHero index="03" eyebrow="About Orko" title={<>Creative work<br /><em>made clear.</em></>} intro="I combine video editing, motion graphics, and graphic design to help ideas look strong and easy to understand." />
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">About me</p><div className="editorial-copy"><h2>I turn ideas into visual work people can follow.</h2><p>{content.biography}</p><div className="split-cards"><article><span>01 / Editing</span><h3>Every cut has a purpose.</h3><p>I use pace, sound, text, and images to keep the story clear and hold attention.</p></article><article><span>02 / Design</span><h3>Clear before decorative.</h3><p>I build strong layouts and motion that support the message instead of hiding it.</p></article></div></div></div></section>
    <section className="editorial-section dark-section"><div className="editorial-grid section-shell"><p className="eyebrow">How I work</p><div className="editorial-copy"><h2>Good questions.<br /><em>Clean delivery.</em></h2><p>I ask the important questions early, explain the creative direction, and keep feedback focused on the project goal.</p><div className="skills-cloud">{["Story editing","Video pacing","Motion graphics","Animated text","Art direction","Campaign versions","Sound timing","Social formats","Organized files","Clear captions"].map((item) => <span key={item}>{item}</span>)}</div></div></div></section>
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Tools</p><div className="editorial-copy"><h2>The right tool for each job.</h2><p>I use Premiere Pro and DaVinci Resolve for editing and finishing, After Effects for motion, and Photoshop, Illustrator, and Figma for design.</p><Link className="text-link" href="/resume">View my résumé <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
    <CtaBand title={<>Have an idea?<br />Let&apos;s make it clear.</>} />
  </>;
}
