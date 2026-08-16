import type { Metadata } from "next";
import { JournalPortal } from "@/components/JournalPortal";
import { PageHero } from "@/components/PageHero";
import { listJournalPosts } from "@/db/repository";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Journal",
  description: "Creative news, practical editing and motion tips, plus development files and build notes from Orko Biswas.",
};

export default async function JournalPage() {
  const posts = await listJournalPosts({ publishedOnly: true });
  return <>
    <PageHero index="04" eyebrow="Studio journal" title={<>Ideas, notes &amp;<br /><em>useful files.</em></>} intro="A living portal for creative news, editing and motion techniques, and the development notes behind the work." />
    <JournalPortal posts={posts} />
  </>;
}
