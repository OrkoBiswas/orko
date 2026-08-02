import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "About", description: `About ${brand.name}, a multidisciplinary video editor, motion designer, and graphic designer.` };

export default function AboutPage() {
  return <>
    <PageHero index="03" eyebrow="About Orko" title={<>Story instinct.<br /><em>Design discipline.</em></>} intro="A multidisciplinary creative practice built around a simple belief: the strongest visual work is felt quickly and understood clearly." />
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">The short version</p><div className="editorial-copy"><h2>Ideas need rhythm.<br />Brands need <em>memory.</em></h2><p>{brand.biography}</p><div className="split-cards"><article><span>01 / Editing philosophy</span><h3>Every cut changes meaning.</h3><p>Pacing is not only speed. It is the balance of anticipation, clarity, surprise, and enough space for an idea to land.</p></article><article><span>02 / Design philosophy</span><h3>Hierarchy before decoration.</h3><p>Scale, contrast, alignment, and timing carry the message. Texture and effects arrive only when they strengthen the voice.</p></article></div></div></div></section>
    <section className="editorial-section dark-section"><div className="editorial-grid section-shell"><p className="eyebrow">Working principles</p><div className="editorial-copy"><h2>Curious in the brief.<br />Precise in <em>delivery.</em></h2><p>The work is collaborative without being directionless. Questions happen early, creative routes have reasons, and reviews stay connected to the objective.</p><div className="skills-cloud">{["Story architecture","Rhythmic editing","Kinetic typography","Motion systems","Art direction","Campaign adaptation","Sound-aware timing","Platform versioning","Source organization","Accessible captions"].map((item) => <span key={item}>{item}</span>)}</div></div></div></section>
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Tools, in context</p><div className="editorial-copy"><h2>The tool serves<br /><em>the decision.</em></h2><p>Premiere Pro and DaVinci Resolve for editorial and finishing; After Effects for motion systems; Photoshop, Illustrator, and Figma for visual development. The software changes. The standard of thought does not.</p><Link className="text-link" href="/resume">View the working résumé <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
    <CtaBand title={<>Bring the messy brief.<br />We’ll find the signal.</>} />
  </>;
}

