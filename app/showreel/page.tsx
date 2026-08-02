import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ShowreelDialog } from "@/components/ShowreelDialog";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = { title: "Showreel", description: "The showreel and selected moving-image work of Orko Biswas." };
export default function ShowreelPage() { return <>
  <PageHero index="05" eyebrow="Showreel" title={<>One minute.<br /><em>Many visual verbs.</em></>} intro="A concise reel spanning edit, motion, type, and campaign work. Final licensed footage and captions are being prepared; the experience will never autoplay sound." />
  <section className="showreel-section section-space"><div className="showreel-poster"><div className="poster-art" aria-hidden="true"><span>SHOW</span><span>REEL</span><i>FINAL MEDIA PENDING</i><b /></div><div className="showreel-controls"><ShowreelDialog triggerLabel="Open reel player" /><div><span>01:12</span><span>Captioned · Keyboard ready · No autoplay audio</span></div></div></div></section>
  <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Planned chapters</p><div className="editorial-copy"><h2>A reel with<br /><em>useful wayfinding.</em></h2><div className="split-cards">{[["00:00","Editorial rhythm"],["00:18","Kinetic type"],["00:34","Campaign systems"],["00:53","Short-form energy"]].map(([time,title]) => <article key={time}><span>{time}</span><h3>{title}</h3><p>Pause markers will link the finished reel back to the relevant case studies without obscuring playback.</p></article>)}</div><Link className="text-link" href="/work">Explore the case studies now <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
  <CtaBand />
  </>; }

