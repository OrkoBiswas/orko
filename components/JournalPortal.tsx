"use client";
/* eslint-disable @next/next/no-img-element -- Cover URLs are owner-validated HTTPS media stored server-side. */

import Link from "next/link";
import { ArrowUpRight, Download, FileCode2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ManagedJournalPost } from "@/db/repository";
import { journalCategories } from "@/lib/portfolio";

function publishDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Studio note" : date.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

export function JournalPortal({ posts }: { posts: ManagedJournalPost[] }) {
  const [category, setCategory] = useState<"all" | ManagedJournalPost["category"]>("all");
  const [query, setQuery] = useState("");
  const visiblePosts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category;
      const searchable = [post.title, post.excerpt, ...post.tags].join(" ").toLowerCase();
      return matchesCategory && (!needle || searchable.includes(needle));
    });
  }, [category, posts, query]);
  const featured = visiblePosts.find((post) => post.featured) ?? visiblePosts[0];
  const remaining = visiblePosts.filter((post) => post.id !== featured?.id);

  return (
    <section className="journal-portal section-shell section-space" aria-labelledby="journal-library-title">
      <div className="journal-tools">
        <div className="journal-filter-tabs" role="tablist" aria-label="Journal categories">
          <button type="button" role="tab" aria-selected={category === "all"} className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>All notes <span>{posts.length}</span></button>
          {journalCategories.map((item) => <button type="button" role="tab" aria-selected={category === item.value} className={category === item.value ? "is-active" : ""} onClick={() => setCategory(item.value)} key={item.value}>{item.label}</button>)}
        </div>
        <label className="journal-search"><Search aria-hidden="true" /><span className="sr-only">Search journal posts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes, topics, files" /></label>
      </div>

      {featured ? <article className={`journal-feature is-${featured.category}`}>
        <div className="journal-feature-art" aria-hidden="true">{featured.coverUrl ? <img src={featured.coverUrl} alt="" /> : <><span /><i /><b>{featured.category === "build-notes" ? "//" : "OB"}</b></>}</div>
        <div className="journal-feature-copy">
          <p className="journal-meta"><span>{journalCategories.find((item) => item.value === featured.category)?.label}</span><time dateTime={featured.publishedAt}>{publishDate(featured.publishedAt)}</time><span>{featured.readingMinutes} min read</span></p>
          <h2 id="journal-library-title"><Link href={`/journal/${featured.slug}`}>{featured.title}</Link></h2>
          <p>{featured.excerpt}</p>
          <div className="journal-tag-list" aria-label="Topics">{featured.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <Link className="journal-read-link" href={`/journal/${featured.slug}`}>Read the note <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </article> : <div className="journal-empty"><FileCode2 aria-hidden="true" /><h2>No notes match that search.</h2><p>Try a different topic, or browse the complete journal.</p><button type="button" onClick={() => { setCategory("all"); setQuery(""); }}>Clear filters</button></div>}

      {remaining.length > 0 && <div className="journal-card-grid">
        {remaining.map((post) => <article className={`journal-card is-${post.category}`} key={post.id}>
          <Link className="journal-card-art" href={`/journal/${post.slug}`} aria-label={`Read ${post.title}`}>
            {post.coverUrl ? <img src={post.coverUrl} alt={post.coverAlt} /> : <><span>{post.category === "creative-news" ? "NEWS" : post.category === "tips-tricks" ? "TIPS" : "BUILD"}</span><i aria-hidden="true" /></>}
          </Link>
          <div className="journal-card-copy"><p className="journal-meta"><span>{journalCategories.find((item) => item.value === post.category)?.label}</span><time dateTime={post.publishedAt}>{publishDate(post.publishedAt)}</time></p><h3><Link href={`/journal/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p><div className="journal-card-bottom"><span>{post.readingMinutes} min read</span><Link href={`/journal/${post.slug}`} aria-label={`Read ${post.title}`}><ArrowUpRight aria-hidden="true" /></Link></div></div>
        </article>)}
      </div>}

      {visiblePosts.some((post) => post.files.length > 0) && <aside className="journal-files-panel" aria-labelledby="journal-files-title">
        <div><p className="eyebrow"><span>Resources</span>Open files</p><h2 id="journal-files-title">Creative tools and <em>build notes.</em></h2><p>Downloads and repositories shared alongside the latest writing.</p></div>
        <div className="journal-file-list">{visiblePosts.flatMap((post) => post.files.map((file) => ({ ...file, post }))).slice(0, 5).map((file) => <a key={file.id} href={file.url} target="_blank" rel="noreferrer"><span className="journal-file-icon"><Download aria-hidden="true" /></span><span><strong>{file.name}</strong><small>{file.description}</small></span><em>{file.format}</em><ArrowUpRight aria-hidden="true" /></a>)}</div>
      </aside>}
    </section>
  );
}
