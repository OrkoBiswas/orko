"use client";

import { useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import type { Project } from "@/lib/portfolio";

type EditableProject = Project & { status: string; displayOrder: number };

function lines(value: string[]) { return value.join("\n"); }
function list(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }

export function AdminProjectEditor({ initial }: { initial: EditableProject }) {
  const [project, setProject] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function change<Key extends keyof EditableProject>(key: Key, value: EditableProject[Key]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setSaved(false);
    const response = await fetch(`/api/admin/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) });
    const result = await response.json().catch(() => ({ message: "Project could not be saved." })) as { ok?: boolean; message?: string };
    if (response.ok && result.ok) { setSaved(true); setMessage("Project changes saved."); }
    else setMessage(result.message ?? "Project could not be saved.");
    setBusy(false);
  }

  return (
    <form className="admin-editor" onSubmit={save}>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Publication</h2><p>Control visibility, featured placement, and archive order.</p></div><div className="admin-form-grid"><label><span>Status</span><select value={project.status} onChange={(event) => change("status", event.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label><span>Display order</span><input type="number" min="0" max="999" value={project.displayOrder} onChange={(event) => change("displayOrder", Number(event.target.value))} /></label><label className="admin-check"><input type="checkbox" checked={project.featured} onChange={(event) => change("featured", event.target.checked)} /><span>Feature on homepage</span></label></div></section>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Project identity</h2><p>The information visitors use to understand and filter this case study.</p></div><div className="admin-form-grid"><label><span>Title</span><input value={project.title} onChange={(event) => change("title", event.target.value)} /></label><label><span>URL slug</span><input value={project.slug} onChange={(event) => change("slug", event.target.value)} /></label><label><span>Index</span><input value={project.index} onChange={(event) => change("index", event.target.value)} /></label><label><span>Category</span><input value={project.category} onChange={(event) => change("category", event.target.value)} /></label><label><span>Industry</span><input value={project.industry} onChange={(event) => change("industry", event.target.value)} /></label><label><span>Client</span><input value={project.client} onChange={(event) => change("client", event.target.value)} /></label><label><span>Year</span><input type="number" min="2000" max="2100" value={project.year} onChange={(event) => change("year", Number(event.target.value))} /></label><label><span>Accent color</span><input type="color" value={project.accent} onChange={(event) => change("accent", event.target.value)} /></label><label><span>Artwork style</span><select value={project.visual} onChange={(event) => change("visual", event.target.value as Project["visual"])}>{["orbit","signal","editorial","spectrum","type","frame"].map((item) => <option value={item} key={item}>{item}</option>)}</select></label><label><span>Artwork ratio</span><select value={project.ratio} onChange={(event) => change("ratio", event.target.value as Project["ratio"])}>{["wide","tall","square"].map((item) => <option value={item} key={item}>{item}</option>)}</select></label></div></section>
      <section className="admin-form-section"><div className="admin-form-intro"><h2>Case study narrative</h2><p>Edit every public story block. Keep each answer concise and specific.</p></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Summary</span><textarea rows={3} value={project.summary} onChange={(event) => change("summary", event.target.value)} /></label><label className="admin-field-wide"><span>Challenge</span><textarea rows={4} value={project.challenge} onChange={(event) => change("challenge", event.target.value)} /></label><label className="admin-field-wide"><span>Creative concept</span><textarea rows={4} value={project.concept} onChange={(event) => change("concept", event.target.value)} /></label><label className="admin-field-wide"><span>Services — one per line</span><textarea rows={4} value={lines(project.services)} onChange={(event) => change("services", list(event.target.value))} /></label><label className="admin-field-wide"><span>Process stages — one per line</span><textarea rows={5} value={lines(project.approach)} onChange={(event) => change("approach", list(event.target.value))} /></label><label className="admin-field-wide"><span>Deliverables — one per line</span><textarea rows={5} value={lines(project.deliverables)} onChange={(event) => change("deliverables", list(event.target.value))} /></label><label className="admin-field-wide"><span>Tools — one per line</span><textarea rows={4} value={lines(project.tools)} onChange={(event) => change("tools", list(event.target.value))} /></label></div></section>
      <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save project"}</button></div>
    </form>
  );
}
