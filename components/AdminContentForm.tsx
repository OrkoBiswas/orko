"use client";

import { useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

const groups: Array<{ title: string; description: string; fields: Array<[keyof SiteContent, string, "text" | "email" | "url" | "textarea"]> }> = [
  { title: "Identity", description: "The name and positioning used across navigation, metadata, and profile pages.", fields: [["name","Public name","text"],["monogram","Monogram","text"],["title","Professional title","text"],["shortTitle","Short descriptor","text"]] },
  { title: "Homepage hero", description: "The first message visitors see and the primary hiring signal.", fields: [["headline","Accessible headline","text"],["heroLineOne","Headline — first line","text"],["heroLineTwo","Headline — accent line","text"],["intro","Opening introduction","textarea"],["availability","Availability","text"],["location","Location","text"],["timezone","Timezone","text"],["responseTime","Response time","text"]] },
  { title: "Homepage sections", description: "Editorial messaging for the work library, showreel, and capabilities sections.", fields: [["workHeading","Work heading","text"],["workIntro","Work introduction","textarea"],["showreelHeading","Showreel heading","text"],["showreelIntro","Showreel introduction","textarea"],["capabilitiesHeading","Capabilities heading","text"],["capabilitiesIntro","Capabilities introduction","textarea"]] },
  { title: "Profile & contact", description: "Public biography, direct contact, social profiles, and calls to action.", fields: [["biography","Biography","textarea"],["email","Contact email","email"],["primaryCta","Primary button label","text"],["secondaryCta","Secondary button label","text"],["instagram","Instagram URL","url"],["linkedin","LinkedIn URL","url"],["behance","Behance URL","url"]] },
  { title: "Search visibility", description: "Default title and description used when the portfolio is shared or discovered.", fields: [["seoTitle","SEO title","text"],["seoDescription","SEO description","textarea"]] },
];

export function AdminContentForm({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage(""); setSaved(false);
    const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const result = await response.json().catch(() => ({ message: "Content could not be saved." })) as { ok?: boolean; message?: string };
    if (response.ok && result.ok) { setSaved(true); setMessage("Published content saved."); }
    else setMessage(result.message ?? "Content could not be saved.");
    setBusy(false);
  }

  return (
    <form className="admin-editor" onSubmit={save}>
      {groups.map((group) => <section className="admin-form-section" key={group.title}><div className="admin-form-intro"><h2>{group.title}</h2><p>{group.description}</p></div><div className="admin-form-grid">{group.fields.map(([key,label,type]) => <label className={type === "textarea" ? "admin-field-wide" : ""} key={key}><span>{label}</span>{type === "textarea" ? <textarea rows={4} value={content[key]} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} /> : <input type={type} value={content[key]} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} />}</label>)}</div></section>)}
      <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save public content"}</button></div>
    </form>
  );
}
