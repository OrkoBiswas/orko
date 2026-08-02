import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = { title: "Process", description: "A clear six-stage creative process for video editing, motion design, and visual work with Orko Biswas." };
const stages = [
  ["Discover", "Get underneath the deliverable.", "Audience, objective, context, references, constraints, source material, stakeholders, and the one thing the work must accomplish."],
  ["Define", "Turn context into a route.", "Story spine, key message, art direction, motion behavior, delivery matrix, milestones, responsibilities, and a scope both sides can trust."],
  ["Create", "Make the thinking visible.", "Rough edits, style frames, motion tests, design explorations, and early proof of the direction before expensive detail work begins."],
  ["Review", "Give feedback a target.", "Each review maps back to the objective. Notes are consolidated, decisions are recorded, and revisions stay focused instead of becoming taste roulette."],
  ["Refine", "Make every detail earn its place.", "Timing, transitions, type, sound, color, crops, captions, and consistency across formats receive the final craft pass."],
  ["Deliver", "Leave the project organized.", "Named masters, platform versions, thumbnails, source files when scoped, font and link notes, plus an archive that another professional can understand."],
];
export default function ProcessPage() { return <>
  <PageHero index="04" eyebrow="How we work" title={<>Creative freedom.<br /><em>Zero fog.</em></>} intro="A practical six-stage process keeps ambitious visual work understandable, reviewable, and moving—without squeezing the life out of it." />
  <section className="process-preview section-shell section-space"><ol className="process-list">{stages.map(([title,tagline,copy], index) => <li key={title} style={{ minHeight: 190 }}><span>0{index + 1}</span><h3>{title}</h3><p><strong>{tagline}</strong><br />{copy}</p><i /></li>)}</ol></section>
  <section className="editorial-section dark-section"><div className="editorial-grid section-shell"><p className="eyebrow">Review rhythm</p><div className="editorial-copy"><h2>Fewer surprises.<br /><em>Better decisions.</em></h2><p>Milestones are agreed before production. Feedback arrives through one decision-maker, grouped by priority, and grounded in the brief. Urgent work can compress the rhythm, but never removes clarity about what is being approved.</p><div className="split-cards"><article><span>Before work</span><h3>Scope and inputs</h3><p>Deliverables, dates, dependencies, usage, source-file expectations, and revision rounds are made explicit.</p></article><article><span>At delivery</span><h3>Versions and archive</h3><p>Final exports are checked against real platform specifications and handed over in a clean, predictable structure.</p></article></div></div></div></section>
  <CtaBand />
  </>; }

