"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Download, Eye, LoaderCircle, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import type { ManagedJournalPost } from "@/db/repository";
import { journalCategories, type JournalDownload } from "@/lib/portfolio";

function tagsFrom(value: string) {
  return [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))].slice(0, 12);
}

function inputDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? new Date().toISOString().slice(0, 16) : date.toISOString().slice(0, 16);
}

export function AdminJournalEditor({ initial, mode = "edit" }: { initial: ManagedJournalPost; mode?: "create" | "edit" }) {
  const router = useRouter();
  const [post, setPost] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function change<Key extends keyof ManagedJournalPost>(key: Key, value: ManagedJournalPost[Key]) {
    setPost((current) => ({ ...current, [key]: value }));
  }

  function addFile() {
    change("files", [...post.files, { id: `file_${crypto.randomUUID().replaceAll("-", "")}`, name: "New resource", description: "Explain what this file helps with.", url: "", format: "ZIP" }]);
  }

  function updateFile(id: string, key: keyof JournalDownload, value: string) {
    change("files", post.files.map((file) => file.id === id ? { ...file, [key]: value } : file));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setSaved(false); setMessage("");
    try {
      const response = await fetch(mode === "create" ? "/api/admin/journal" : `/api/admin/journal/${post.id}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      const result = await response.json().catch(() => ({ message: "Journal post could not be saved." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Journal post could not be saved.");
      setSaved(true);
      setMessage(mode === "create" ? "Journal post created. Opening the editor…" : "Journal post saved. The public portal is up to date.");
      if (mode === "create") { router.push(`/admin/journal/${post.id}`); router.refresh(); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Journal post could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function removePost() {
    if (mode !== "edit" || !window.confirm(`Archive “${post.title}” from the journal? It will stay in the audit history.`)) return;
    setDeleting(true); setSaved(false); setMessage("");
    try {
      const response = await fetch(`/api/admin/journal/${post.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({ message: "Journal post could not be archived." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Journal post could not be archived.");
      router.push("/admin/journal"); router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Journal post could not be archived.");
      setDeleting(false);
    }
  }

  return <form className="admin-editor admin-journal-editor" onSubmit={save}>
    <header className="admin-project-composer-bar">
      <div><Link href="/admin/journal"><ArrowLeft aria-hidden="true" /> Journal</Link><span>{mode === "create" ? "New post" : "Editing"}</span><strong>{post.title}</strong></div>
      <div><label><span className="sr-only">Publishing status</span><select value={post.status} onChange={(event) => change("status", event.target.value as ManagedJournalPost["status"])}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>{mode === "edit" && <Link href={`/journal/${post.slug}`} target="_blank"><Eye aria-hidden="true" /> Preview</Link>}<button type="submit" disabled={busy || deleting}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : mode === "create" ? "Create post" : "Save post"}</button></div>
    </header>

    <section className="admin-journal-intro"><div><span><Sparkles aria-hidden="true" /></span><div><p className="admin-kicker">Publishing workspace</p><h2>Turn a studio thought into a useful <em>portal note.</em></h2><p>Write creative news, sharp how-tos, or build notes. Add public Cloudinary or GitHub file URLs when you want to share resources.</p></div></div><div><strong>{post.status === "published" ? "Live" : post.status === "draft" ? "Private draft" : "Archived"}</strong><span>{post.files.length} shared file{post.files.length === 1 ? "" : "s"}</span></div></section>

    <section className="admin-simple-settings">
      <details open><summary><span>01</span><strong>Story and publishing</strong><small>The public title, category, summary, and schedule</small><span>Open</span></summary><div className="admin-form-grid"><label className="admin-field-wide"><span>Title</span><input required maxLength={180} value={post.title} onChange={(event) => change("title", event.target.value)} /></label><label><span>Journal category</span><select value={post.category} onChange={(event) => change("category", event.target.value as ManagedJournalPost["category"])}>{journalCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label><label><span>Reading time (minutes)</span><input type="number" min="1" max="60" value={post.readingMinutes} onChange={(event) => change("readingMinutes", Math.max(1, Number(event.target.value) || 1))} /></label><label><span>Publish date and time</span><input required type="datetime-local" value={inputDate(post.publishedAt)} onChange={(event) => change("publishedAt", new Date(event.target.value).toISOString())} /></label><label><span>Display order</span><input type="number" min="0" max="999" value={post.displayOrder} onChange={(event) => change("displayOrder", Math.max(0, Number(event.target.value) || 0))} /></label><label className="admin-check"><input type="checkbox" checked={post.featured} onChange={(event) => change("featured", event.target.checked)} /><span>Feature this post at the top of the portal</span></label><label className="admin-field-wide"><span>URL slug</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={post.slug} onChange={(event) => change("slug", event.target.value.toLowerCase().replace(/\s+/g, "-"))} /><small>Use lowercase words separated by hyphens.</small></label><label className="admin-field-wide"><span>Short introduction</span><textarea required rows={3} maxLength={600} value={post.excerpt} onChange={(event) => change("excerpt", event.target.value)} /></label><label className="admin-field-wide"><span>Story body</span><textarea required rows={14} maxLength={12000} value={post.body} onChange={(event) => change("body", event.target.value)} /><small>Use blank lines to create readable paragraphs. The portal renders this as safe plain text—no raw HTML is accepted.</small></label></div></details>

      <details><summary><span>02</span><strong>Visual identity and topics</strong><small>Cover media, accessible description, and searchable tags</small><span>Open</span></summary><div className="admin-form-grid"><label className="admin-field-wide"><span>Cover image or video poster URL</span><input type="url" placeholder="https://res.cloudinary.com/..." value={post.coverUrl} onChange={(event) => change("coverUrl", event.target.value)} /><small>Optional. Leave blank for the portal’s designed category artwork.</small></label><label className="admin-field-wide"><span>Cover description</span><input maxLength={300} value={post.coverAlt} onChange={(event) => change("coverAlt", event.target.value)} /></label><label className="admin-field-wide"><span>Topics — comma separated</span><input value={post.tags.join(", ")} onChange={(event) => change("tags", tagsFrom(event.target.value))} placeholder="Motion design, Workflow, After Effects" /><small>Up to 12 short, searchable topic labels.</small></label></div></details>

      <details><summary><span>03</span><strong>Development files and downloads</strong><small>Public resources hosted on Cloudinary, GitHub, or another secure URL</small><span>Open</span></summary><div className="admin-journal-files"><div className="admin-form-intro"><div><h2>Shared resources</h2><p>Add project files, templates, repositories, or build artifacts. Only public HTTPS URLs are accepted and no storage credentials are exposed.</p></div><button className="admin-add-button" type="button" onClick={addFile} disabled={post.files.length >= 20}><Plus aria-hidden="true" /> Add resource</button></div>{post.files.length ? <div className="admin-journal-file-grid">{post.files.map((file, index) => <article key={file.id}><header><span>{String(index + 1).padStart(2, "0")}</span><button type="button" onClick={() => change("files", post.files.filter((item) => item.id !== file.id))} aria-label={`Remove ${file.name}`}><X aria-hidden="true" /></button></header><label><span>File name</span><input required value={file.name} onChange={(event) => updateFile(file.id, "name", event.target.value)} /></label><label><span>Format</span><input required value={file.format} onChange={(event) => updateFile(file.id, "format", event.target.value)} placeholder="ZIP, Repository, Figma" /></label><label className="admin-field-wide"><span>Public URL</span><input required type="url" value={file.url} onChange={(event) => updateFile(file.id, "url", event.target.value)} placeholder="https://..." /></label><label className="admin-field-wide"><span>What is inside?</span><textarea rows={2} value={file.description} onChange={(event) => updateFile(file.id, "description", event.target.value)} /></label></article>)}</div> : <div className="admin-journal-file-empty"><Download aria-hidden="true" /><p>No files attached yet. Add a public resource when the note includes something readers can use.</p></div>}</div></details>
    </section>

    {mode === "edit" && <section className="admin-danger-zone"><div><strong>Archive this post</strong><p>It will disappear from the journal but stay protected in the audit history.</p></div><button type="button" onClick={() => void removePost()} disabled={busy || deleting}><Trash2 aria-hidden="true" />{deleting ? "Archiving…" : "Archive post"}</button></section>}
    <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy || deleting}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : mode === "create" ? "Create post" : "Save post"}</button></div>
  </form>;
}
