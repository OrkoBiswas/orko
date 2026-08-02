"use client";

import { useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import type { Service } from "@/lib/portfolio";

function lines(items: string[]) { return items.join("\n"); }
function list(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
function faqLines(items: Service["faqs"]) { return items.map((item) => `${item.question} | ${item.answer}`).join("\n"); }
function faqList(value: string) { return value.split("\n").map((line) => { const separator = line.indexOf("|"); return separator > 0 ? { question: line.slice(0, separator).trim(), answer: line.slice(separator + 1).trim() } : null; }).filter((item): item is { question: string; answer: string } => Boolean(item?.question && item.answer)); }

export function AdminServiceEditor({ initial, originalSlug }: { initial: Service; originalSlug: string }) {
  const [service, setService] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  function change<Key extends keyof Service>(key: Key, value: Service[Key]) { setService((current) => ({ ...current, [key]: value })); }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setSaved(false);
    const response = await fetch(`/api/admin/services/${originalSlug}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(service) });
    const result = await response.json().catch(() => ({ message: "Service could not be saved." })) as { ok?: boolean; message?: string };
    if (response.ok && result.ok) { setSaved(true); setMessage("Service changes saved."); }
    else setMessage(result.message ?? "Service could not be saved.");
    setBusy(false);
  }
  return <form className="admin-editor" onSubmit={save}>
    <section className="admin-form-section"><div className="admin-form-intro"><h2>Service identity</h2><p>Control how this capability appears in the service directory and navigation paths.</p></div><div className="admin-form-grid"><label><span>Service title</span><input value={service.title} onChange={(event) => change("title", event.target.value)} /></label><label><span>URL slug</span><input value={service.slug} onChange={(event) => change("slug", event.target.value)} /></label><label><span>Display number</span><input value={service.number} onChange={(event) => change("number", event.target.value)} /></label><label className="admin-field-wide"><span>Short positioning line</span><textarea rows={3} value={service.short} onChange={(event) => change("short", event.target.value)} /></label><label className="admin-field-wide"><span>Service promise</span><textarea rows={4} value={service.promise} onChange={(event) => change("promise", event.target.value)} /></label></div></section>
    <section className="admin-form-section"><div className="admin-form-intro"><h2>Offer details</h2><p>Define the commercial framing and the visitors this service is designed for.</p></div><div className="admin-form-grid"><label><span>Typical timeline</span><input value={service.timeline} onChange={(event) => change("timeline", event.target.value)} /></label><label><span>Pricing mode</span><input value={service.pricing} onChange={(event) => change("pricing", event.target.value)} /></label><label className="admin-field-wide"><span>Deliverables — one per line</span><textarea rows={6} value={lines(service.deliverables)} onChange={(event) => change("deliverables", list(event.target.value))} /></label><label className="admin-field-wide"><span>Ideal clients — one per line</span><textarea rows={6} value={lines(service.idealFor)} onChange={(event) => change("idealFor", list(event.target.value))} /></label><label className="admin-field-wide"><span>Related project slugs — one per line</span><textarea rows={5} value={lines(service.related)} onChange={(event) => change("related", list(event.target.value))} /></label></div></section>
    <section className="admin-form-section"><div className="admin-form-intro"><h2>Frequently asked questions</h2><p>Use one line per question with a vertical bar between the question and answer.</p></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Question | Answer</span><textarea rows={8} value={faqLines(service.faqs)} onChange={(event) => change("faqs", faqList(event.target.value))} /></label></div></section>
    <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save service"}</button></div>
  </form>;
}
