import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = { title: "Process", description: "A clear six-stage creative process for video editing, motion design, and visual work with Orko Biswas." };
const stages = [
  ["Discover", "Understand the project.", "We discuss your audience, goal, references, deadline, budget, and available files."],
  ["Plan", "Choose a clear direction.", "I prepare the story, visual style, deliverables, schedule, and review points."],
  ["Create", "Build the first version.", "I make the first edit, design, style frame, or motion test so you can see the direction early."],
  ["Review", "Share focused feedback.", "You collect the important notes in one place, and I confirm the next changes."],
  ["Refine", "Improve every detail.", "I polish timing, transitions, text, sound, color, captions, and platform versions."],
  ["Deliver", "Receive clean files.", "You get clearly named exports in the correct sizes, plus source files when they are included."],
];
export default function ProcessPage() { return <>
  <PageHero index="04" eyebrow="How I work" title={<>A clear process.<br /><em>Better results.</em></>} intro="Six simple stages keep the work organized, make feedback easier, and leave enough space for good ideas." />
  <section className="process-preview section-shell section-space"><ol className="process-list">{stages.map(([title,tagline,copy], index) => <li key={title} style={{ minHeight: 190 }}><span>0{index + 1}</span><h3>{title}</h3><p><strong>{tagline}</strong><br />{copy}</p><i /></li>)}</ol></section>
  <section className="editorial-section dark-section"><div className="editorial-grid section-shell"><p className="eyebrow">Feedback and delivery</p><div className="editorial-copy"><h2>Clear reviews.<br /><em>Clean files.</em></h2><p>We agree on review stages before the work begins. Feedback stays in one place and focuses on the project goal, so changes remain clear and useful.</p><div className="split-cards"><article><span>Before work</span><h3>Scope and materials</h3><p>We confirm the files, deliverables, dates, usage, source-file needs, and revision rounds.</p></article><article><span>At delivery</span><h3>Correct versions</h3><p>Every export is checked for its platform and delivered with clear names and folders.</p></article></div></div></div></section>
  <CtaBand />
  </>; }
