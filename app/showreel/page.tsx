import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ShowreelLoop } from "@/components/ShowreelLoop";
import { CtaBand } from "@/components/CtaBand";
import { getSiteContent } from "@/db/repository";

export const metadata: Metadata = { title: "Showreel", description: "The showreel and selected moving-image work of Orko Biswas." };
export const dynamic = "force-dynamic";
export default async function ShowreelPage() {
  const content = await getSiteContent();
  return <>
  <PageHero index="05" eyebrow="Showreel" title={<>A quick look<br />at my <em>work.</em></>} intro="A compact visual loop of editing, motion, titles, and design. It plays silently inside the page and never opens a popup." />
  <ShowreelLoop heading={content.showreelHeading} intro={content.showreelIntro} videoUrl={content.showreelVideoUrl} posterUrl={content.showreelPosterUrl} />
  <CtaBand />
  </>;
}
