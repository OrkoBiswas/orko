/* eslint-disable @next/next/no-img-element -- Cover URLs are owner-validated HTTPS media stored server-side. */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Download, FileCode2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getJournalPostBySlug } from "@/db/repository";
import { journalCategories } from "@/lib/portfolio";

export const dynamic = "force-dynamic";
type Params = Promise<{ slug: string }>;

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Studio journal" : date.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug, { publishedOnly: true });
  return post ? { title: post.title, description: post.excerpt, alternates: { canonical: `/journal/${post.slug}` } } : { title: "Journal" };
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug, { publishedOnly: true });
  if (!post) notFound();
  const category = journalCategories.find((item) => item.value === post.category);
  const paragraphs = post.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  return <article className={`journal-article is-${post.category}`}>
    <header className="journal-article-hero section-shell">
      <Link className="journal-back" href="/journal"><ArrowLeft aria-hidden="true" /> All journal notes</Link>
      <div className="journal-article-meta"><span>{category?.label}</span><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time><span>{post.readingMinutes} min read</span></div>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <div className="journal-tag-list">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="journal-article-art" aria-hidden={!post.coverUrl}>{post.coverUrl ? <img src={post.coverUrl} alt={post.coverAlt} /> : <><span /><i /><b>{post.category === "build-notes" ? "// BUILD" : "OB / NOTES"}</b></>}</div>
    </header>
    <div className="journal-article-body section-shell">
      <div className="journal-article-copy">{paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}</div>
      <aside className="journal-article-aside"><div><FileCode2 aria-hidden="true" /><span>{category?.description}</span></div><Link href="/start-a-project">Need a creative partner? <ArrowUpRight aria-hidden="true" /></Link></aside>
    </div>
    {post.files.length > 0 && <section className="journal-article-files section-shell" aria-labelledby="journal-downloads"><div><p className="eyebrow"><span>Downloads</span>Shared resources</p><h2 id="journal-downloads">Files from this <em>note.</em></h2></div><div>{post.files.map((file) => <a href={file.url} target="_blank" rel="noreferrer" key={file.id}><Download aria-hidden="true" /><span><strong>{file.name}</strong><small>{file.description}</small></span><em>{file.format}</em><ArrowUpRight aria-hidden="true" /></a>)}</div></section>}
  </article>;
}
