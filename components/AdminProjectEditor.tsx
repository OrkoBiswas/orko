"use client";
/* eslint-disable @next/next/no-img-element -- The owner can select any secure Cloudinary delivery URL. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Image as ImageIcon, LoaderCircle, Save, Star, Trash2, Upload } from "lucide-react";
import type { Project, ProjectGalleryItem } from "@/lib/portfolio";

type EditableProject = Project & { status: string; displayOrder: number };
type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };
type UploadResponse = { secure_url?: string; resource_type?: "image" | "video" | "raw"; error?: { message?: string } };

const frameOptions = [
  ["wide", "Landscape / HD video (16:9)"],
  ["vertical", "Vertical short / reel (9:16)"],
  ["square", "Square artwork (1:1)"],
  ["tall", "Poster / portrait (4:5)"],
  ["banner", "Wide banner (21:9)"],
] as const;

function lines(value: string[]) { return value.join("\n"); }
function list(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
function galleryId() { return `project-media-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`; }

export function AdminProjectEditor({ initial, mode = "edit" }: { initial: EditableProject; mode?: "create" | "edit" }) {
  const router = useRouter();
  const [project, setProject] = useState<EditableProject>({ ...initial, mediaUrl: initial.mediaUrl ?? "", mediaType: initial.mediaType ?? "generated", mediaAlt: initial.mediaAlt ?? "", gallery: initial.gallery ?? [] });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function change<Key extends keyof EditableProject>(key: Key, value: EditableProject[Key]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  function updateGallery(id: string, field: "alt" | "type" | "title" | "category" | "client" | "industry" | "year", value: string | number | null) {
    setProject((current) => ({ ...current, gallery: (current.gallery ?? []).map((item) => item.id === id ? { ...item, [field]: value } as ProjectGalleryItem : item) }));
  }

  function setCover(item: ProjectGalleryItem) {
    setProject((current) => ({ ...current, mediaUrl: item.url, mediaType: item.type, mediaAlt: item.alt || `${current.title} project preview` }));
  }

  function removeGalleryItem(id: string) {
    setProject((current) => {
      const removed = (current.gallery ?? []).find((item) => item.id === id);
      const gallery = (current.gallery ?? []).filter((item) => item.id !== id);
      if (!removed || current.mediaUrl !== removed.url) return { ...current, gallery };
      const next = gallery[0];
      return { ...current, gallery, mediaUrl: next?.url ?? "", mediaType: next?.type ?? "generated", mediaAlt: next?.alt ?? "" };
    });
  }

  function moveGalleryItem(id: string, offset: -1 | 1) {
    setProject((current) => {
      const gallery = [...(current.gallery ?? [])];
      const index = gallery.findIndex((item) => item.id === id);
      const destination = index + offset;
      if (index < 0 || destination < 0 || destination >= gallery.length) return current;
      [gallery[index], gallery[destination]] = [gallery[destination], gallery[index]];
      return { ...current, gallery };
    });
  }

  async function uploadGallery(files: File[]) {
    const remaining = 24 - (project.gallery?.length ?? 0);
    const selected = files.slice(0, remaining);
    if (!selected.length) { setSaved(false); setMessage("This project gallery already has 24 files."); return; }
    const invalid = selected.find((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"));
    if (invalid) { setSaved(false); setMessage("Choose image or video files only."); return; }
    const oversized = selected.find((file) => file.size > 100 * 1024 * 1024);
    if (oversized) { setSaved(false); setMessage(`${oversized.name} is larger than the 100 MB upload limit.`); return; }
    setUploading(true); setSaved(false); setMessage(""); setUploadStatus(`Preparing ${selected.length} file${selected.length === 1 ? "" : "s"}â€¦`);
    let completed = 0;
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      for (const file of selected) {
        setUploadStatus(`Uploading ${completed + 1} of ${selected.length}: ${file.name}`);
        const form = new FormData();
        form.set("file", file); form.set("api_key", signed.apiKey); form.set("signature", signed.signature);
        for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/auto/upload`, { method: "POST", body: form });
        const uploaded = await response.json().catch(() => ({})) as UploadResponse;
        if (!response.ok || !uploaded.secure_url || (uploaded.resource_type !== "image" && uploaded.resource_type !== "video")) throw new Error(uploaded.error?.message ?? `${file.name} could not be uploaded.`);
        const itemTitle = file.name.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " ").trim();
        const item: ProjectGalleryItem = { id: galleryId(), type: uploaded.resource_type, url: uploaded.secure_url, alt: `${project.title} â€” ${itemTitle}`, title: itemTitle, category: project.category, client: project.client, industry: project.industry, year: project.year };
        setProject((current) => {
          const useAsCover = !current.mediaUrl || current.mediaType === "generated";
          return { ...current, gallery: [...(current.gallery ?? []), item], ...(useAsCover ? { mediaUrl: item.url, mediaType: item.type, mediaAlt: item.alt } : {}) };
        });
        completed += 1;
      }
      setMessage(`${completed} file${completed === 1 ? "" : "s"} uploaded. Choose Save project to publish the gallery.`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The project files could not be uploaded.";
      setMessage(completed ? `${completed} file${completed === 1 ? " was" : "s were"} uploaded before a problem occurred. ${detail}` : detail);
    } finally { setUploading(false); setUploadStatus(""); }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage(""); setSaved(false);
    try {
      const response = await fetch(mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project.id}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const result = await response.json().catch(() => ({ message: "Project could not be saved." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Project could not be saved.");
      setSaved(true);
      setMessage(mode === "create" ? "Project created. Opening the editor…" : "Project changes saved.");
      if (mode === "create") { router.push(`/admin/projects/${project.id}`); router.refresh(); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project could not be saved.");
    } finally { setBusy(false); }
  }

  async function removeProject() {
    if (mode !== "edit" || !window.confirm(`Remove “${project.title}” from the project library? The record stays in the audit history.`)) return;
    setDeleting(true); setSaved(false); setMessage("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({ message: "Project could not be deleted." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Project could not be deleted.");
      router.push("/admin/projects"); router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project could not be deleted.");
      setDeleting(false);
    }
  }

  return (
    <form className="admin-editor" onSubmit={save}>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Publication</h2><p>Control visibility, featured placement, and library order.</p></div><div className="admin-form-grid"><label><span>Status</span><select value={project.status} onChange={(event) => change("status", event.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label><span>Display order</span><input type="number" min="0" max="999" value={project.displayOrder} onChange={(event) => change("displayOrder", Number(event.target.value))} /></label><label className="admin-check"><input type="checkbox" checked={project.featured} onChange={(event) => change("featured", event.target.checked)} /><span>Feature on homepage</span></label></div></section>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Showcase identity</h2><p>The information visitors use to understand and filter this work.</p></div><div className="admin-form-grid"><label><span>Title</span><input required value={project.title} onChange={(event) => change("title", event.target.value)} /></label><label><span>URL slug</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={project.slug} onChange={(event) => change("slug", event.target.value)} /></label><label><span>Index</span><input required value={project.index} onChange={(event) => change("index", event.target.value)} /></label><label><span>Category</span><input required value={project.category} onChange={(event) => change("category", event.target.value)} /></label><label><span>Industry</span><input required value={project.industry} onChange={(event) => change("industry", event.target.value)} /></label><label><span>Client</span><input required value={project.client} onChange={(event) => change("client", event.target.value)} /></label><label><span>Year</span><input type="number" min="2000" max="2100" value={project.year} onChange={(event) => change("year", Number(event.target.value))} /></label><label><span>Accent color</span><input type="color" value={project.accent} onChange={(event) => change("accent", event.target.value)} /></label><label><span>Fallback artwork</span><select value={project.visual} onChange={(event) => change("visual", event.target.value as Project["visual"])}>{["orbit","signal","editorial","spectrum","type","frame"].map((item) => <option value={item} key={item}>{item}</option>)}</select></label><label><span>Frame format</span><select value={project.ratio} onChange={(event) => change("ratio", event.target.value as Project["ratio"])}>{frameOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div></section>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Cover media</h2><p>This image or video appears in the homepage showcase and work archive. Gallery uploads can be selected as the cover.</p><Link className="admin-inline-link" href="/admin/media" target="_blank"><ImageIcon aria-hidden="true" /> Open media library</Link></div><div className="admin-form-grid"><label><span>Media type</span><select value={project.mediaType} onChange={(event) => change("mediaType", event.target.value as Project["mediaType"])}><option value="generated">Generated demo preview</option><option value="image">Image</option><option value="video">Video or motion</option></select></label><label className="admin-field-wide"><span>Secure media URL</span><input type="url" placeholder="https://res.cloudinary.com/…" value={project.mediaUrl} onChange={(event) => change("mediaUrl", event.target.value)} /></label><label className="admin-field-wide"><span>Media description</span><input placeholder="Describe the visible work for accessibility" value={project.mediaAlt} onChange={(event) => change("mediaAlt", event.target.value)} /></label>{project.mediaUrl && project.mediaType !== "generated" && <div className="admin-project-media-preview admin-field-wide">{project.mediaType === "video" ? <video src={project.mediaUrl} controls muted preload="metadata" /> : <img src={project.mediaUrl} alt={project.mediaAlt || "Project preview"} />}</div>}</div></section>
      <section className="admin-form-section admin-project-gallery-section">
        <div className="admin-form-intro">
          <h2>Project gallery</h2>
          <p>Upload several images and videos for this project. Reorder them, write accessible descriptions, and choose any file as the public cover.</p>
          <label className="admin-media-attach"><input type="file" accept="image/*,video/*" multiple disabled={uploading || (project.gallery?.length ?? 0) >= 24} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void uploadGallery(files); }} /><Upload aria-hidden="true" />{uploading ? "Uploading…" : "Upload images and videos"}</label>
          <small className="admin-limit-note">{project.gallery?.length ?? 0} of 24 files</small>
          {uploadStatus && <small className="admin-upload-status" role="status">{uploadStatus}</small>}
        </div>
        <div className="admin-project-gallery-list">
          {project.gallery?.length ? project.gallery.map((item, index) => {
            const isCover = project.mediaUrl === item.url;
            return <article className="admin-project-gallery-item" key={item.id}>
              <div className="admin-project-gallery-preview">{item.type === "video" ? <video src={item.url} controls muted preload="metadata" aria-label={item.alt || `Project video ${index + 1}`} /> : <img src={item.url} alt={item.alt || `Project image ${index + 1}`} />}{isCover && <span><Star aria-hidden="true" /> Cover</span>}</div>
              <div className="admin-project-gallery-fields">
                <div><strong>Media {String(index + 1).padStart(2, "0")}</strong><small>{item.type}</small></div>
                <label><span>Media type</span><select value={item.type} onChange={(event) => updateGallery(item.id, "type", event.target.value)}><option value="image">Image</option><option value="video">Video</option></select></label>
                <label className="admin-field-wide"><span>Work title</span><input value={item.title} placeholder="Name this individual work" onChange={(event) => updateGallery(item.id, "title", event.target.value)} /></label>
                <label><span>Category</span><input value={item.category} placeholder="Example: Motion design" onChange={(event) => updateGallery(item.id, "category", event.target.value)} /></label>
                <label><span>Client</span><input value={item.client} placeholder="Client or project name" onChange={(event) => updateGallery(item.id, "client", event.target.value)} /></label>
                <label><span>Industry</span><input value={item.industry} placeholder="Example: Technology" onChange={(event) => updateGallery(item.id, "industry", event.target.value)} /></label>
                <label><span>Year</span><input type="number" min="2000" max="2100" value={item.year ?? ""} placeholder="2026" onChange={(event) => updateGallery(item.id, "year", event.target.value ? Number(event.target.value) : null)} /></label>
                <label className="admin-field-wide"><span>Image/video description</span><input value={item.alt} placeholder="Describe what visitors can see" onChange={(event) => updateGallery(item.id, "alt", event.target.value)} /></label>
                <div className="admin-project-gallery-actions"><button type="button" disabled={index === 0} onClick={() => moveGalleryItem(item.id, -1)} aria-label={`Move media ${index + 1} earlier`}><ArrowUp aria-hidden="true" /></button><button type="button" disabled={index === (project.gallery?.length ?? 0) - 1} onClick={() => moveGalleryItem(item.id, 1)} aria-label={`Move media ${index + 1} later`}><ArrowDown aria-hidden="true" /></button><button type="button" className={isCover ? "is-cover" : ""} disabled={isCover} onClick={() => setCover(item)}><Star aria-hidden="true" />{isCover ? "Current cover" : "Set as cover"}</button><button type="button" className="is-remove" onClick={() => removeGalleryItem(item.id)}><Trash2 aria-hidden="true" /> Remove</button></div>
              </div>
            </article>;
          }) : <div className="admin-record-empty"><p>No gallery files yet.</p><span>Select several images or videos above. The first upload becomes the cover automatically.</span></div>}
        </div>
      </section>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Project story</h2><p>Edit every public story block. Keep each answer clear and specific.</p></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Summary</span><textarea required rows={3} value={project.summary} onChange={(event) => change("summary", event.target.value)} /></label><label className="admin-field-wide"><span>Challenge</span><textarea required rows={4} value={project.challenge} onChange={(event) => change("challenge", event.target.value)} /></label><label className="admin-field-wide"><span>Creative concept</span><textarea required rows={4} value={project.concept} onChange={(event) => change("concept", event.target.value)} /></label><label className="admin-field-wide"><span>Services — one per line</span><textarea rows={4} value={lines(project.services)} onChange={(event) => change("services", list(event.target.value))} /></label><label className="admin-field-wide"><span>Process stages — one per line</span><textarea rows={5} value={lines(project.approach)} onChange={(event) => change("approach", list(event.target.value))} /></label><label className="admin-field-wide"><span>Deliverables — one per line</span><textarea rows={5} value={lines(project.deliverables)} onChange={(event) => change("deliverables", list(event.target.value))} /></label><label className="admin-field-wide"><span>Tools — one per line</span><textarea rows={4} value={lines(project.tools)} onChange={(event) => change("tools", list(event.target.value))} /></label></div></section>
      {mode === "edit" && <section className="admin-danger-zone"><div><strong>Remove this project</strong><p>This hides it from the website and dashboard while keeping a safe audit record.</p></div><button type="button" onClick={() => void removeProject()} disabled={deleting || busy || uploading}><Trash2 aria-hidden="true" />{deleting ? "Removing…" : "Delete project"}</button></section>}
      <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy || deleting || uploading}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : mode === "create" ? "Create project" : "Save project"}</button></div>
    </form>
  );
}
