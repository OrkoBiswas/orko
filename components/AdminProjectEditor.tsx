"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Eye, LoaderCircle, Save, SlidersHorizontal, Trash2 } from "lucide-react";
import { AdminProjectContentBuilder } from "@/components/AdminProjectContentBuilder";
import type { Project, ProjectContentBlock } from "@/lib/portfolio";

type EditableProject = Project & { status: string; displayOrder: number };

const frameOptions = [
  ["wide", "Landscape / HD video (16:9)"],
  ["vertical", "Vertical short / reel (9:16)"],
  ["square", "Square artwork (1:1)"],
  ["tall", "Poster / portrait (4:5)"],
  ["banner", "Wide banner (21:9)"],
] as const;

function lines(value: string[]) { return value.join("\n"); }
function list(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }

function legacyBlocks(project: EditableProject): ProjectContentBlock[] {
  if (project.contentBlocks?.length) return project.contentBlocks;
  return (project.gallery ?? []).filter((item) => item.url !== project.mediaUrl).map((item) => item.type === "video" ? {
    id: `legacy-${item.id}`, type: "video-audio" as const, width: "wide" as const, mediaType: "video" as const,
    url: item.url, posterUrl: "", alt: item.alt, caption: item.title,
  } : {
    id: `legacy-${item.id}`, type: "image" as const, width: "wide" as const,
    url: item.url, alt: item.alt, caption: item.title,
  });
}

export function AdminProjectEditor({ initial, mode = "edit" }: { initial: EditableProject; mode?: "create" | "edit" }) {
  const router = useRouter();
  const [project, setProject] = useState<EditableProject>({
    ...initial,
    mediaUrl: initial.mediaUrl ?? "",
    mediaType: initial.mediaType ?? "generated",
    mediaAlt: initial.mediaAlt ?? "",
    gallery: initial.gallery ?? [],
    contentBlocks: legacyBlocks(initial),
    presentation: initial.presentation ?? { background: "#f4f2ea", textColor: "#171a16", contentWidth: "wide", spacing: "balanced" },
    customCta: initial.customCta ?? { enabled: false, label: "Visit project", url: "" },
    assets: initial.assets ?? [],
  });
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function change<Key extends keyof EditableProject>(key: Key, value: EditableProject[Key]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setSaved(false);
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
    } finally {
      setBusy(false);
    }
  }

  async function removeProject() {
    if (mode !== "edit" || !window.confirm(`Remove “${project.title}” from the project library? The record stays in the audit history.`)) return;
    setDeleting(true);
    setSaved(false);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({ message: "Project could not be deleted." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Project could not be deleted.");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project could not be deleted.");
      setDeleting(false);
    }
  }

  return <form className="admin-editor admin-project-composer" onSubmit={save}>
    <header className="admin-project-composer-bar">
      <div><Link href="/admin/projects"><ArrowLeft aria-hidden="true" /> Projects</Link><span>{mode === "create" ? "New project" : "Editing"}</span><strong>{project.title}</strong></div>
      <div><label><span className="sr-only">Project status</span><select value={project.status} onChange={(event) => change("status", event.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>{mode === "edit" && <Link href={`/work/${project.slug}`} target="_blank"><Eye aria-hidden="true" /> Preview</Link>}<button type="submit" disabled={busy || deleting}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : mode === "create" ? "Create" : "Save"}</button></div>
    </header>

    <AdminProjectContentBuilder
      projectTitle={project.title}
      blocks={project.contentBlocks ?? []}
      presentation={project.presentation ?? { background: "#f4f2ea", textColor: "#171a16", contentWidth: "wide", spacing: "balanced" }}
      customCta={project.customCta ?? { enabled: false, label: "Visit project", url: "" }}
      assets={project.assets ?? []}
      onBlocksChange={(contentBlocks) => change("contentBlocks", contentBlocks)}
      onPresentationChange={(presentation) => change("presentation", presentation)}
      onCustomCtaChange={(customCta) => change("customCta", customCta)}
      onAssetsChange={(assets) => change("assets", assets)}
    />

    <section className="admin-simple-settings">
      <div className="admin-simple-settings-head"><div><SlidersHorizontal aria-hidden="true" /><span><strong>Project settings</strong><small>Title, category, publishing, and project details</small></span></div><p>Category thumbnails are managed separately from the Projects dashboard.</p></div>

      <details open><summary><span>01</span><strong>Basic information</strong><small>Title, category, client, and summary</small><span>Open</span></summary><div className="admin-form-grid"><label><span>Title</span><input required value={project.title} onChange={(event) => change("title", event.target.value)} /></label><label><span>Public category</span><input required placeholder="e.g. Brand Identity" value={project.category} onChange={(event) => change("category", event.target.value)} /><small>Use the same spelling to place more projects on this category shelf.</small></label><label><span>Client</span><input required value={project.client} onChange={(event) => change("client", event.target.value)} /></label><label><span>Industry</span><input required value={project.industry} onChange={(event) => change("industry", event.target.value)} /></label><label><span>Year</span><input type="number" min="2000" max="2100" value={project.year} onChange={(event) => change("year", Number(event.target.value))} /></label><label className="admin-field-wide"><span>Short summary</span><textarea required rows={3} value={project.summary} onChange={(event) => change("summary", event.target.value)} /></label></div></details>

      <details><summary><span>02</span><strong>Publishing</strong><small>Visibility and placement</small><span>Open</span></summary><div className="admin-form-grid"><label><span>Status</span><select value={project.status} onChange={(event) => change("status", event.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label><span>Display order</span><input type="number" min="0" max="999" value={project.displayOrder} onChange={(event) => change("displayOrder", Number(event.target.value))} /></label><label className="admin-check"><input type="checkbox" checked={project.featured} onChange={(event) => change("featured", event.target.checked)} /><span>Feature on homepage</span></label></div></details>

      <details><summary><span>03</span><strong>Advanced details</strong><small>URL, search information, credits, and project layout</small><span>Open</span></summary><div className="admin-form-grid"><label><span>URL slug</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={project.slug} onChange={(event) => change("slug", event.target.value)} /></label><label><span>Index</span><input required value={project.index} onChange={(event) => change("index", event.target.value)} /></label><label><span>Project card format</span><select value={project.ratio} onChange={(event) => change("ratio", event.target.value as Project["ratio"])}>{frameOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Accent color</span><input type="color" value={project.accent} onChange={(event) => change("accent", event.target.value)} /></label><label><span>Fallback artwork</span><select value={project.visual} onChange={(event) => change("visual", event.target.value as Project["visual"])}>{["orbit", "signal", "editorial", "spectrum", "type", "frame"].map((item) => <option value={item} key={item}>{item}</option>)}</select></label><label className="admin-field-wide"><span>Challenge</span><textarea required rows={4} value={project.challenge} onChange={(event) => change("challenge", event.target.value)} /></label><label className="admin-field-wide"><span>Creative concept</span><textarea required rows={4} value={project.concept} onChange={(event) => change("concept", event.target.value)} /></label><label className="admin-field-wide"><span>Services — one per line</span><textarea rows={4} value={lines(project.services)} onChange={(event) => change("services", list(event.target.value))} /></label><label className="admin-field-wide"><span>Process stages — one per line</span><textarea rows={5} value={lines(project.approach)} onChange={(event) => change("approach", list(event.target.value))} /></label><label className="admin-field-wide"><span>Deliverables — one per line</span><textarea rows={5} value={lines(project.deliverables)} onChange={(event) => change("deliverables", list(event.target.value))} /></label><label className="admin-field-wide"><span>Tools — one per line</span><textarea rows={4} value={lines(project.tools)} onChange={(event) => change("tools", list(event.target.value))} /></label></div></details>
    </section>

    {mode === "edit" && <section className="admin-danger-zone"><div><strong>Remove this project</strong><p>This hides it from the website and dashboard while keeping a safe audit record.</p></div><button type="button" onClick={() => void removeProject()} disabled={deleting || busy}><Trash2 aria-hidden="true" />{deleting ? "Removing…" : "Delete project"}</button></section>}
    <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy || deleting}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : mode === "create" ? "Create project" : "Save project"}</button></div>
  </form>;
}
