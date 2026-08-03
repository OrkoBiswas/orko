"use client";
/* eslint-disable @next/next/no-img-element -- Owner-provided branding is delivered by validated Cloudinary URLs. */

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, ExternalLink, ImageUp, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { notifyAdmin } from "@/components/AdminNotificationCenter";

type ProfileLink = SiteContent["profileLinks"][number];
type AssetField = "logoUrl" | "faviconUrl" | "socialImageUrl";
type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };
type UploadResponse = { secure_url?: string; resource_type?: string; error?: { message?: string } };

const platforms: ProfileLink["platform"][] = ["fiverr", "dribbble", "behance", "discord", "linkedin", "instagram", "youtube", "custom"];

function linkId() {
  return `profile-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export function AdminGrowthSettings({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<AssetField | "">("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function change<Key extends keyof SiteContent>(key: Key, value: SiteContent[Key]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function updateLink(id: string, patch: Partial<ProfileLink>) {
    change("profileLinks", content.profileLinks.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function addLink() {
    change("profileLinks", [...content.profileLinks, { id: linkId(), platform: "fiverr", label: "Hire me on Fiverr", url: "", enabled: true, featured: true }]);
  }

  function moveLink(index: number, direction: -1 | 1) {
    const next = [...content.profileLinks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    change("profileLinks", next);
  }

  async function uploadAsset(field: AssetField, file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.name.toLowerCase().endsWith(".ico")) { setMessage("Choose an image or favicon file."); return; }
    if (file.size > 15 * 1024 * 1024) { setMessage("Brand assets must be smaller than 15 MB."); return; }
    setUploading(field); setSaved(false); setMessage("");
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      const form = new FormData();
      form.set("file", file); form.set("api_key", signed.apiKey); form.set("signature", signed.signature);
      for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/image/upload`, { method: "POST", body: form });
      const uploaded = await response.json().catch(() => ({})) as UploadResponse;
      if (!response.ok || !uploaded.secure_url || uploaded.resource_type !== "image") throw new Error(uploaded.error?.message ?? "The brand asset could not be uploaded.");
      change(field, uploaded.secure_url);
      setMessage("Upload complete. Save settings to publish it.");
      notifyAdmin({ tone: "success", title: "Brand asset uploaded", message: "The image is ready. Save settings to publish it on the website." });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The brand asset could not be uploaded.");
      notifyAdmin({ tone: "error", title: "Upload not completed", message: "The brand image could not be uploaded. Please try again." });
    } finally {
      setUploading("");
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setSaved(false); setMessage("");
    const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const result = await response.json().catch(() => ({ message: "Settings could not be saved." })) as { ok?: boolean; message?: string };
    if (response.ok && result.ok) { setSaved(true); setMessage("Growth, metadata, and brand settings published."); }
    else setMessage(result.message ?? "Settings could not be saved.");
    setBusy(false);
  }

  return <form className="admin-editor admin-growth-editor" onSubmit={save}>
    <section className="admin-form-section"><div className="admin-form-intro"><h2>Brand assets</h2><p>Control the website logo, browser icon, social share image, color, and public headline. Uploads use your protected media account.</p></div><div className="admin-form-grid">
      <label><span>Website name</span><input value={content.name} onChange={(event) => change("name", event.target.value)} /></label>
      <label><span>Monogram fallback</span><input value={content.monogram} onChange={(event) => change("monogram", event.target.value)} /></label>
      <label><span>Public/accessible headline</span><input value={content.headline} onChange={(event) => change("headline", event.target.value)} /></label>
      <label><span>Hero headline — first line</span><input value={content.heroLineOne} onChange={(event) => change("heroLineOne", event.target.value)} /></label>
      <label><span>Hero headline — accent line</span><input value={content.heroLineTwo} onChange={(event) => change("heroLineTwo", event.target.value)} /></label>
      <label><span>Theme color</span><input type="color" value={content.themeColor} onChange={(event) => change("themeColor", event.target.value)} /></label>
      <label className="admin-field-wide"><span>Logo description</span><input value={content.logoAlt} onChange={(event) => change("logoAlt", event.target.value)} /></label>
      {(["logoUrl", "faviconUrl", "socialImageUrl"] as AssetField[]).map((field) => {
        const labels: Record<AssetField, string> = { logoUrl: "Website logo", faviconUrl: "Favicon", socialImageUrl: "Social share image" };
        return <div className="admin-brand-asset admin-field-wide" key={field}><div>{content[field] ? <img src={content[field]} alt="" /> : <span>No file</span>}</div><label><span>{labels[field]} URL</span><input type="url" value={content[field]} onChange={(event) => change(field, event.target.value)} /><span className="admin-upload-button"><ImageUp aria-hidden="true" />{uploading === field ? "Uploading…" : "Upload image"}<input type="file" accept="image/*,.ico" disabled={Boolean(uploading)} onChange={(event) => void uploadAsset(field, event.target.files?.[0])} /></span>{field === "logoUrl" && <span className="admin-logo-size-control"><span>Website logo width — {content.logoWidth}px</span><input type="range" min="20" max="200" step="1" value={content.logoWidth} aria-label="Website logo width in pixels" onChange={(event) => change("logoWidth", Number(event.target.value))} /><span>Website logo height — {content.logoHeight}px</span><input type="range" min="20" max="200" step="1" value={content.logoHeight} aria-label="Website logo height in pixels" onChange={(event) => change("logoHeight", Number(event.target.value))} /><small>Both dimensions support 20–200 px. The artwork keeps its original proportions without stretching.</small></span>}</label></div>;
      })}
    </div></section>

    <section className="admin-form-section"><div className="admin-form-intro"><h2>SEO, AEO & GEO</h2><p>Manage search snippets, AI-answer context, location relevance, canonical identity, crawler access, and site verification from one place.</p></div><div className="admin-form-grid">
      <label className="admin-field-wide"><span>Search title</span><input value={content.seoTitle} onChange={(event) => change("seoTitle", event.target.value)} /></label>
      <label className="admin-field-wide"><span>Meta description</span><textarea rows={3} value={content.seoDescription} onChange={(event) => change("seoDescription", event.target.value)} /></label>
      <label className="admin-field-wide"><span>Keywords — comma separated</span><input value={content.seoKeywords} onChange={(event) => change("seoKeywords", event.target.value)} /></label>
      <label className="admin-field-wide"><span>Canonical website URL (optional)</span><input type="url" placeholder="https://yourdomain.com" value={content.canonicalUrl} onChange={(event) => change("canonicalUrl", event.target.value)} /></label>
      <label><span>Site language</span><input placeholder="en" value={content.siteLanguage} onChange={(event) => change("siteLanguage", event.target.value)} /></label>
      <label><span>Service area</span><input placeholder="Worldwide" value={content.serviceArea} onChange={(event) => change("serviceArea", event.target.value)} /></label>
      <label className="admin-field-wide"><span>Answer-engine summary</span><textarea rows={4} value={content.aeoSummary} onChange={(event) => change("aeoSummary", event.target.value)} /></label>
      <label className="admin-field-wide"><span>Expertise areas — comma separated</span><input value={content.expertiseAreas} onChange={(event) => change("expertiseAreas", event.target.value)} /></label>
      <label><span>Google verification token</span><input value={content.googleSiteVerification} onChange={(event) => change("googleSiteVerification", event.target.value)} /></label>
      <label><span>Bing verification token</span><input value={content.bingSiteVerification} onChange={(event) => change("bingSiteVerification", event.target.value)} /></label>
      <label className="admin-check-field admin-field-wide"><input type="checkbox" checked={content.searchIndexing} onChange={(event) => change("searchIndexing", event.target.checked)} /><span>Allow search engines and AI discovery systems to index the public website</span></label>
    </div></section>

    <section className="admin-form-section"><div className="admin-form-intro"><h2>Analytics & GTM</h2><p>Add a Google Tag Manager container when you are ready. Leave it empty to load no tracking code.</p></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Google Tag Manager container ID</span><input placeholder="GTM-XXXXXXX" value={content.gtmContainerId} onChange={(event) => change("gtmContainerId", event.target.value.toUpperCase())} /></label></div></section>

    <section className="admin-form-section admin-collection-section"><div className="admin-form-intro"><h2>Hire-me links</h2><p>Highlight service pages and profiles such as Fiverr, Dribbble, Behance, Discord, LinkedIn, Instagram, YouTube, or any custom destination.</p><button className="admin-add-button" type="button" onClick={addLink} disabled={content.profileLinks.length >= 10}><Plus aria-hidden="true" /> Add link</button></div><div className="admin-form-grid"><label className="admin-field-wide"><span>Section headline</span><input value={content.profileLinksHeading} onChange={(event) => change("profileLinksHeading", event.target.value)} /></label></div><div className="admin-record-list">
      {content.profileLinks.map((link, index) => <fieldset className="admin-record admin-profile-record" key={link.id}><legend>Link {String(index + 1).padStart(2, "0")}</legend><button className="admin-remove-button" type="button" onClick={() => change("profileLinks", content.profileLinks.filter((item) => item.id !== link.id))}><Trash2 aria-hidden="true" /> Remove</button><div className="admin-form-grid">
        <label><span>Platform</span><select value={link.platform} onChange={(event) => updateLink(link.id, { platform: event.target.value as ProfileLink["platform"] })}>{platforms.map((platform) => <option value={platform} key={platform}>{platform[0].toUpperCase() + platform.slice(1)}</option>)}</select></label>
        <label><span>Public label</span><input value={link.label} onChange={(event) => updateLink(link.id, { label: event.target.value })} /></label>
        <label className="admin-field-wide"><span>Profile or service URL</span><input type="url" value={link.url} onChange={(event) => updateLink(link.id, { url: event.target.value })} /></label>
        <label className="admin-check-field"><input type="checkbox" checked={link.enabled} onChange={(event) => updateLink(link.id, { enabled: event.target.checked })} /><span>Visible</span></label>
        <label className="admin-check-field"><input type="checkbox" checked={link.featured} onChange={(event) => updateLink(link.id, { featured: event.target.checked })} /><span>Highlight this link</span></label>
        <div className="admin-profile-actions admin-field-wide"><button type="button" onClick={() => moveLink(index, -1)} disabled={index === 0} aria-label={`Move ${link.label || `link ${index + 1}`} up`}><ArrowUp aria-hidden="true" /></button><button type="button" onClick={() => moveLink(index, 1)} disabled={index === content.profileLinks.length - 1} aria-label={`Move ${link.label || `link ${index + 1}`} down`}><ArrowDown aria-hidden="true" /></button>{link.url && <a className="admin-inline-link" href={link.url} target="_blank" rel="noreferrer">Test link <ExternalLink aria-hidden="true" /></a>}</div>
      </div></fieldset>)}
    </div></section>

    <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy || Boolean(uploading)}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save growth settings"}</button></div>
  </form>;
}
