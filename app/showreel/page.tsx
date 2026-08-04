import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ShowreelLoop } from "@/components/ShowreelLoop";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = { title: "Showreel", description: "The showreel and selected moving-image work of Orko Biswas." };
export default function ShowreelPage() { return <>
  <PageHero index="05" eyebrow="Showreel" title={<>A quick look<br />at my <em>work.</em></>} intro="A compact visual loop of editing, motion, titles, and design. It plays silently inside the page and never opens a popup." />
  <ShowreelLoop heading="Motion in one continuous flow." intro="A focused visual preview built to move with the page. Scroll into the frame, watch the loop, pause when needed, then enter the full work archive." />
  <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Planned chapters</p><div className="editorial-copy"><h2>A reel with<br /><em>useful wayfinding.</em></h2><div className="split-cards">{[["00:00","Editorial rhythm"],["00:18","Kinetic type"],["00:34","Campaign systems"],["00:53","Short-form energy"]].map(([time,title]) => <article key={time}><span>{time}</span><h3>{title}</h3><p>Pause markers will link the finished reel back to the relevant case studies without obscuring playback.</p></article>)}</div><Link className="text-link" href="/work">Explore the case studies now <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
  <CtaBand />
  </>; }
