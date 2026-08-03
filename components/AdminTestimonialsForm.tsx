"use client";

import { useState } from "react";
import { Check, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type Testimonial = SiteContent["testimonials"][number];

function recordId() {
  return `testimonial-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export function AdminTestimonialsForm({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function update(id: string, field: keyof Omit<Testimonial, "id">, value: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  }

  function add() {
    setContent((current) => ({ ...current, testimonials: [...current.testimonials, { id: recordId(), quote: "", name: "", role: "", company: "" }] }));
  }

  function remove(id: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.filter((item) => item.id !== id) }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setSaved(false); setMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const result = await response.json().catch(() => ({ message: "Testimonials could not be saved." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Testimonials could not be saved.");
      setSaved(true); setMessage("Testimonials saved and published.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Testimonials could not be saved.");
    } finally { setBusy(false); }
  }

  return <form className="admin-editor" onSubmit={save}>
    <section className="admin-form-section"><div className="admin-form-intro"><h2>Section introduction</h2><p>Set the public title and short introduction shown above the auto-sliding feedback area.</p></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Heading</span><input required value={content.testimonialsHeading} onChange={(event) => setContent((current) => ({ ...current, testimonialsHeading: event.target.value }))} /></label><label className="admin-field-wide"><span>Introduction</span><textarea required rows={4} value={content.testimonialsIntro} onChange={(event) => setContent((current) => ({ ...current, testimonialsIntro: event.target.value }))} /></label></div></section>
    <section className="admin-form-section admin-collection-section"><div className="admin-form-intro"><h2>Client testimonials</h2><p>Add only genuine feedback approved by the person. Testimonials appear in this order and slide automatically on the public website.</p><button className="admin-add-button" type="button" onClick={add} disabled={content.testimonials.length >= 8}><Plus aria-hidden="true" /> Add testimonial</button><small className="admin-limit-note">{content.testimonials.length} of 8 entries</small></div><div className="admin-record-list">{content.testimonials.length ? content.testimonials.map((testimonial, index) => <fieldset className="admin-record" key={testimonial.id}><legend>Testimonial {String(index + 1).padStart(2, "0")}</legend><button className="admin-remove-button" type="button" onClick={() => remove(testimonial.id)} aria-label={`Remove testimonial ${index + 1}`}><Trash2 aria-hidden="true" /> Remove</button><div className="admin-form-grid"><label className="admin-field-wide"><span>Approved quote</span><textarea required rows={5} value={testimonial.quote} onChange={(event) => update(testimonial.id, "quote", event.target.value)} /></label><label><span>Person’s name</span><input required value={testimonial.name} onChange={(event) => update(testimonial.id, "name", event.target.value)} /></label><label><span>Role (optional)</span><input value={testimonial.role} onChange={(event) => update(testimonial.id, "role", event.target.value)} /></label><label className="admin-field-wide"><span>Company (optional)</span><input value={testimonial.company} onChange={(event) => update(testimonial.id, "company", event.target.value)} /></label></div></fieldset>) : <div className="admin-record-empty"><p>No testimonials published yet.</p><span>Add approved feedback when it is ready. The public website will not display invented quotes.</span></div>}</div></section>
    <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save testimonials"}</button></div>
  </form>;
}
