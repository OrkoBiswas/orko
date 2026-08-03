"use client";
/* eslint-disable @next/next/no-img-element -- Testimonial sources are dynamic Cloudinary delivery URLs. */

import Link from "next/link";
import { useState } from "react";
import { Check, Image as ImageIcon, LoaderCircle, Plus, Save, Trash2, Upload } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type Testimonial = SiteContent["testimonials"][number];
type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };
type UploadResponse = { secure_url?: string; resource_type?: "image" | "video" | "raw"; error?: { message?: string } };

function recordId() {
  return `testimonial-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export function AdminTestimonialsForm({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploadingId, setUploadingId] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function update(id: string, field: keyof Omit<Testimonial, "id">, value: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  }

  function add() {
    setContent((current) => ({ ...current, testimonials: [...current.testimonials, { id: recordId(), quote: "", name: "", role: "", company: "", mediaType: "none", mediaUrl: "", mediaAlt: "" }] }));
  }

  function remove(id: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.filter((item) => item.id !== id) }));
  }

  function clearMedia(id: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.map((item) => item.id === id ? { ...item, mediaType: "none", mediaUrl: "", mediaAlt: "" } : item) }));
  }

  async function uploadMedia(id: string, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) { setSaved(false); setMessage("Choose an image or video file."); return; }
    if (file.size > 100 * 1024 * 1024) { setSaved(false); setMessage("The selected file is larger than the 100 MB upload limit."); return; }
    setUploadingId(id); setSaved(false); setMessage("");
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      const form = new FormData();
      form.set("file", file);
      form.set("api_key", signed.apiKey);
      form.set("signature", signed.signature);
      for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/auto/upload`, { method: "POST", body: form });
      const uploaded = await response.json().catch(() => ({})) as UploadResponse;
      if (!response.ok || !uploaded.secure_url || (uploaded.resource_type !== "image" && uploaded.resource_type !== "video")) throw new Error(uploaded.error?.message ?? "The client media could not be uploaded.");
      setContent((current) => ({ ...current, testimonials: current.testimonials.map((item) => item.id === id ? { ...item, mediaType: uploaded.resource_type as "image" | "video", mediaUrl: uploaded.secure_url ?? "", mediaAlt: item.mediaAlt || `${item.name || "Client"} testimonial ${uploaded.resource_type}` } : item) }));
      setSaved(true); setMessage("Client media uploaded. Save testimonials to publish it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The client media could not be uploaded.");
    } finally { setUploadingId(""); }
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
    <section className="admin-form-section"><div className="admin-form-intro"><h2>Section introduction</h2><p>Set the public title and short introduction shown above the auto-sliding feedback cards.</p></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Heading</span><input required value={content.testimonialsHeading} onChange={(event) => setContent((current) => ({ ...current, testimonialsHeading: event.target.value }))} /></label><label className="admin-field-wide"><span>Introduction</span><textarea required rows={4} value={content.testimonialsIntro} onChange={(event) => setContent((current) => ({ ...current, testimonialsIntro: event.target.value }))} /></label></div></section>
    <section className="admin-form-section admin-collection-section"><div className="admin-form-intro"><h2>Client testimonials</h2><p>Add approved feedback with an optional client image or video. Media appears beside the quote in a balanced card.</p><button className="admin-add-button" type="button" onClick={add} disabled={content.testimonials.length >= 8}><Plus aria-hidden="true" /> Add testimonial</button><small className="admin-limit-note">{content.testimonials.length} of 8 entries</small><Link className="admin-inline-link" href="/admin/media" target="_blank"><ImageIcon aria-hidden="true" /> Open full media library</Link></div><div className="admin-record-list">{content.testimonials.length ? content.testimonials.map((testimonial, index) => <fieldset className="admin-record admin-testimonial-record" key={testimonial.id}><legend>Testimonial {String(index + 1).padStart(2, "0")}</legend><button className="admin-remove-button" type="button" onClick={() => remove(testimonial.id)} aria-label={`Remove testimonial ${index + 1}`}><Trash2 aria-hidden="true" /> Remove</button><div className="admin-form-grid"><label className="admin-field-wide"><span>Approved quote</span><textarea required rows={5} value={testimonial.quote} onChange={(event) => update(testimonial.id, "quote", event.target.value)} /></label><label><span>Person’s name</span><input required value={testimonial.name} onChange={(event) => update(testimonial.id, "name", event.target.value)} /></label><label><span>Role (optional)</span><input value={testimonial.role} onChange={(event) => update(testimonial.id, "role", event.target.value)} /></label><label className="admin-field-wide"><span>Company (optional)</span><input value={testimonial.company} onChange={(event) => update(testimonial.id, "company", event.target.value)} /></label><div className="admin-testimonial-media admin-field-wide"><div className="admin-testimonial-media-head"><div><span>Client media</span><small>Optional image or video</small></div><label className="admin-media-attach"><input type="file" accept="image/*,video/*" disabled={uploadingId === testimonial.id} onChange={(event) => void uploadMedia(testimonial.id, event.target.files?.[0])} /><Upload aria-hidden="true" />{uploadingId === testimonial.id ? "Uploading…" : testimonial.mediaUrl ? "Replace file" : "Attach file"}</label></div><div className="admin-form-grid"><label><span>Media type</span><select value={testimonial.mediaType} onChange={(event) => update(testimonial.id, "mediaType", event.target.value)}><option value="none">No media</option><option value="image">Image</option><option value="video">Video</option></select></label><label className="admin-field-wide"><span>Secure media URL</span><input type="url" placeholder="https://res.cloudinary.com/…" value={testimonial.mediaUrl} onChange={(event) => update(testimonial.id, "mediaUrl", event.target.value)} /></label><label className="admin-field-wide"><span>Media description</span><input placeholder="Example: Portrait of the client speaking in their studio" value={testimonial.mediaAlt} onChange={(event) => update(testimonial.id, "mediaAlt", event.target.value)} /></label></div>{testimonial.mediaUrl && testimonial.mediaType !== "none" && <div className="admin-testimonial-preview">{testimonial.mediaType === "video" ? <video src={testimonial.mediaUrl} controls muted preload="metadata" aria-label={testimonial.mediaAlt || `${testimonial.name} testimonial video`} /> : <img src={testimonial.mediaUrl} alt={testimonial.mediaAlt || `${testimonial.name} testimonial`} />}<button type="button" onClick={() => clearMedia(testimonial.id)}><Trash2 aria-hidden="true" /> Remove attachment</button></div>}</div></div></fieldset>) : <div className="admin-record-empty"><p>No testimonials published yet.</p><span>Add approved feedback when it is ready. The public website will not display invented quotes.</span></div>}</div></section>
    <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy || Boolean(uploadingId)}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save testimonials"}</button></div>
  </form>;
}
