"use client";
/* eslint-disable @next/next/no-img-element -- The owner portrait uses a validated Cloudinary delivery URL. */

import { useState } from "react";
import { Check, ImageUp, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { notifyAdmin } from "@/components/AdminNotificationCenter";
import type { SiteContent } from "@/lib/site-content";

type ScalarSiteContentKey = { [Key in keyof SiteContent]: SiteContent[Key] extends string ? Key : never }[keyof SiteContent];
type Experience = SiteContent["experiences"][number];
type Testimonial = SiteContent["testimonials"][number];
type AboutGalleryItem = SiteContent["aboutGallery"][number];
type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };
type UploadResponse = { secure_url?: string; resource_type?: string; error?: { message?: string } };

const groups: Array<{ title: string; description: string; fields: Array<[ScalarSiteContentKey, string, "text" | "email" | "url" | "textarea"]> }> = [
  { title: "Identity", description: "The name and positioning used across navigation, metadata, and profile pages.", fields: [["name","Public name","text"],["monogram","Monogram","text"],["title","Professional title","text"],["shortTitle","Short descriptor","text"]] },
  { title: "Homepage hero", description: "The first message visitors see and the primary hiring signal.", fields: [["headline","Accessible headline","text"],["heroLineOne","Headline — first line","text"],["heroLineTwo","Headline — accent line","text"],["intro","Opening introduction","textarea"],["availability","Availability","text"],["location","Location","text"],["timezone","Timezone","text"],["responseTime","Response time","text"]] },
  { title: "Homepage sections", description: "Editorial messaging for the work library, showreel, capabilities, experience, and testimonial sections.", fields: [["workHeading","Work heading","text"],["workIntro","Work introduction","textarea"],["showreelHeading","Showreel heading","text"],["showreelIntro","Showreel introduction","textarea"],["capabilitiesHeading","Capabilities heading","text"],["capabilitiesIntro","Capabilities introduction","textarea"],["experienceHeading","Experience heading","text"],["experienceIntro","Experience introduction","textarea"],["testimonialsHeading","Testimonials heading","text"],["testimonialsIntro","Testimonials introduction","textarea"]] },
  { title: "About page", description: "Keep the personal story concise. These notes explain your work life, career direction, and how you care for client projects.", fields: [["aboutWorkLife","Work-life note","textarea"],["aboutCareer","Career note","textarea"],["aboutClientCare","Client-care note","textarea"]] },
  { title: "Profile & contact", description: "Public biography, direct contact, social profiles, and calls to action.", fields: [["biography","Biography","textarea"],["email","Contact email","email"],["primaryCta","Primary button label","text"],["secondaryCta","Secondary button label","text"],["instagram","Instagram URL","url"],["linkedin","LinkedIn URL","url"],["behance","Behance URL","url"]] },
  { title: "Search visibility", description: "Default title and description used when the portfolio is shared or discovered.", fields: [["seoTitle","SEO title","text"],["seoDescription","SEO description","textarea"]] },
];

function recordId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export function AdminContentForm({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [uploadingAboutPhoto, setUploadingAboutPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  async function uploadPortrait(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setSaved(false); setMessage("Choose an image file for your portrait."); return; }
    if (file.size > 15 * 1024 * 1024) { setSaved(false); setMessage("The portrait image must be smaller than 15 MB."); return; }
    setUploadingPortrait(true); setSaved(false); setMessage("");
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      const form = new FormData();
      form.set("file", file); form.set("api_key", signed.apiKey); form.set("signature", signed.signature);
      for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/image/upload`, { method: "POST", body: form });
      const uploaded = await response.json().catch(() => ({})) as UploadResponse;
      if (!response.ok || !uploaded.secure_url || uploaded.resource_type !== "image") throw new Error("The portrait could not be uploaded.");
      setContent((current) => ({ ...current, profileImageUrl: uploaded.secure_url ?? "", profileImageAlt: current.profileImageAlt || `Portrait of ${current.name}` }));
      setMessage("Portrait uploaded. Save public content to publish it.");
      notifyAdmin({ tone: "success", title: "Portrait uploaded", message: "The image is ready. Save public content to publish it in About & experience." });
    } catch {
      setMessage("The portrait could not be uploaded. Please try again.");
      notifyAdmin({ tone: "error", title: "Upload not completed", message: "The portrait image could not be uploaded. Please try again." });
    } finally { setUploadingPortrait(false); }
  }

  async function uploadAboutGalleryMedia(id: string, file?: File) {
    if (!file) return;
    const resourceType = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
    if (!resourceType) { setSaved(false); setMessage("Choose an image or video for the About media frames."); return; }
    const maximumBytes = resourceType === "video" ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maximumBytes) { setSaved(false); setMessage(resourceType === "video" ? "Each About video must be smaller than 100 MB." : "Each About image must be smaller than 15 MB."); return; }
    setUploadingAboutPhoto(id); setSaved(false); setMessage("");
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      const form = new FormData();
      form.set("file", file); form.set("api_key", signed.apiKey); form.set("signature", signed.signature);
      for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${resourceType}/upload`, { method: "POST", body: form });
      const uploaded = await response.json().catch(() => ({})) as UploadResponse;
      if (!response.ok || !uploaded.secure_url || uploaded.resource_type !== resourceType) throw new Error("The About media could not be uploaded.");
      setContent((current) => ({
        ...current,
        aboutGallery: current.aboutGallery.map((item) => item.id === id ? { ...item, mediaType: resourceType, url: uploaded.secure_url ?? "" } : item),
      }));
      setMessage("About media uploaded. Save public content to publish it.");
      notifyAdmin({ tone: "success", title: "About media uploaded", message: "The image or video is ready. Save public content to publish it in the Work, life & trust section." });
    } catch {
      setMessage("The About image or video could not be uploaded. Please try again.");
      notifyAdmin({ tone: "error", title: "Upload not completed", message: "The About media could not be uploaded. Please try again." });
    } finally { setUploadingAboutPhoto(null); }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage(""); setSaved(false);
    const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const result = await response.json().catch(() => ({ message: "Content could not be saved." })) as { ok?: boolean; message?: string };
    if (response.ok && result.ok) { setSaved(true); setMessage("Published content saved."); }
    else setMessage(result.message ?? "Content could not be saved.");
    setBusy(false);
  }

  function updateExperience(id: string, field: keyof Omit<Experience, "id">, value: string) {
    setContent((current) => ({ ...current, experiences: current.experiences.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  }

  function addExperience() {
    setContent((current) => ({
      ...current,
      experiences: [...current.experiences, { id: recordId("experience"), organization: "", role: "", period: "", location: "", summary: "" }],
    }));
  }

  function removeExperience(id: string) {
    setContent((current) => ({ ...current, experiences: current.experiences.filter((item) => item.id !== id) }));
  }

  function updateAboutGalleryItem(id: string, field: keyof Omit<AboutGalleryItem, "id">, value: string) {
    setContent((current) => ({ ...current, aboutGallery: current.aboutGallery.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  }

  function addAboutGalleryItem() {
    setContent((current) => ({
      ...current,
      aboutGallery: [...current.aboutGallery, { id: recordId("about-media"), mediaType: "image", url: "", posterUrl: "", alt: `Orko Biswas at work`, caption: ["Working process", "Studio moments", "Behind the work"][current.aboutGallery.length] ?? "Creative process" }],
    }));
  }

  function removeAboutGalleryItem(id: string) {
    setContent((current) => ({ ...current, aboutGallery: current.aboutGallery.filter((item) => item.id !== id) }));
  }

  function updateTestimonial(id: string, field: keyof Omit<Testimonial, "id">, value: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  }

  function addTestimonial() {
    setContent((current) => ({
      ...current,
      testimonials: [...current.testimonials, { id: recordId("testimonial"), quote: "", name: "", role: "", company: "", mediaType: "none", mediaUrl: "", mediaAlt: "" }],
    }));
  }

  function removeTestimonial(id: string) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.filter((item) => item.id !== id) }));
  }

  return (
    <form className="admin-editor" onSubmit={save}>
      {groups.map((group) => <section className="admin-form-section" key={group.title}><div className="admin-form-intro"><h2>{group.title}</h2><p>{group.description}</p></div><div className="admin-form-grid">{group.fields.map(([key,label,type]) => <label className={type === "textarea" ? "admin-field-wide" : ""} key={key}><span>{label}</span>{type === "textarea" ? <textarea rows={4} value={content[key]} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} /> : <input type={type} value={content[key]} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} />}</label>)}</div></section>)}
      <section className="admin-form-section admin-profile-image-section">
        <div className="admin-form-intro"><h2>About portrait</h2><p>Upload a clear photo of yourself so visitors can recognize the person behind the work. The image appears in the About &amp; experience section.</p></div>
        <div className="admin-profile-image-editor">
          <div className={`admin-profile-image-preview${content.profileImageUrl ? " has-image" : ""}`}>
            {content.profileImageUrl ? <img src={content.profileImageUrl} alt={content.profileImageAlt || `Portrait of ${content.name}`} /> : <div><ImageUp aria-hidden="true" /><span>No portrait uploaded</span></div>}
          </div>
          <div className="admin-profile-image-controls">
            <label><span>Portrait image URL</span><input type="url" placeholder="https://res.cloudinary.com/..." value={content.profileImageUrl} onChange={(event) => setContent((current) => ({ ...current, profileImageUrl: event.target.value }))} /></label>
            <label><span>Image description</span><input placeholder={`Portrait of ${content.name}`} value={content.profileImageAlt} onChange={(event) => setContent((current) => ({ ...current, profileImageAlt: event.target.value }))} /></label>
            <div className="admin-profile-image-actions">
              <label className="admin-media-attach"><input type="file" accept="image/*" disabled={uploadingPortrait} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; void uploadPortrait(file); }} /><ImageUp aria-hidden="true" />{uploadingPortrait ? "Uploading..." : content.profileImageUrl ? "Replace portrait" : "Upload portrait"}</label>
              {content.profileImageUrl && <button type="button" onClick={() => setContent((current) => ({ ...current, profileImageUrl: "", profileImageAlt: "" }))}><Trash2 aria-hidden="true" />Remove portrait</button>}
            </div>
            <small>Use a well-lit portrait. The website crops it responsively without changing the original file.</small>
          </div>
        </div>
      </section>
      <section className="admin-form-section admin-collection-section admin-about-gallery-section">
        <div className="admin-form-intro"><h2>Work, life &amp; trust media</h2><p>Control the three creative frames shown in this About-page section. Each frame accepts a studio image, working-process video, or another real moment from your practice.</p><button className="admin-add-button" type="button" onClick={addAboutGalleryItem} disabled={content.aboutGallery.length >= 3 || Boolean(uploadingAboutPhoto)}><Plus aria-hidden="true" />Add media frame</button></div>
        <div className="admin-record-list">
          {content.aboutGallery.length > 0 ? content.aboutGallery.map((photo, index) => <fieldset className="admin-record admin-about-photo-record" key={photo.id}>
            <legend>Media frame {String(index + 1).padStart(2, "0")}</legend>
            <button className="admin-remove-button" type="button" onClick={() => removeAboutGalleryItem(photo.id)} disabled={Boolean(uploadingAboutPhoto)} aria-label={`Remove About media frame ${index + 1}`}><Trash2 aria-hidden="true" />Remove</button>
            <div className={`admin-about-photo-preview${photo.url ? " has-image" : ""}`}>
              {photo.url ? photo.mediaType === "video" ? <video src={photo.url} poster={photo.posterUrl || undefined} controls muted playsInline preload="metadata" aria-label={photo.alt || "About video preview"} /> : <img src={photo.url} alt={photo.alt || "About image preview"} /> : <div><ImageUp aria-hidden="true" /><span>No media attached</span></div>}
            </div>
            <div className="admin-form-grid">
              <label><span>Media type</span><select value={photo.mediaType} onChange={(event) => updateAboutGalleryItem(photo.id, "mediaType", event.target.value as AboutGalleryItem["mediaType"])}><option value="image">Image</option><option value="video">Video</option></select></label>
              <label><span>Frame label</span><input value={photo.caption} placeholder="Working process" onChange={(event) => updateAboutGalleryItem(photo.id, "caption", event.target.value)} /></label>
              <label className="admin-field-wide"><span>Secure media URL</span><input type="url" placeholder="https://res.cloudinary.com/..." value={photo.url} onChange={(event) => updateAboutGalleryItem(photo.id, "url", event.target.value)} /></label>
              {photo.mediaType === "video" && <label className="admin-field-wide"><span>Video poster URL (optional)</span><input type="url" placeholder="https://res.cloudinary.com/..." value={photo.posterUrl} onChange={(event) => updateAboutGalleryItem(photo.id, "posterUrl", event.target.value)} /></label>}
              <label className="admin-field-wide"><span>Accessible media description</span><input value={photo.alt} placeholder="Describe what visitors can see" onChange={(event) => updateAboutGalleryItem(photo.id, "alt", event.target.value)} /></label>
            </div>
            <label className="admin-media-attach admin-about-photo-upload"><input type="file" accept="image/*,video/*" disabled={Boolean(uploadingAboutPhoto)} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; void uploadAboutGalleryMedia(photo.id, file); }} /><ImageUp aria-hidden="true" />{uploadingAboutPhoto === photo.id ? "Uploading..." : photo.url ? "Replace media" : "Upload image or video"}</label>
          </fieldset>) : <div className="admin-record-empty"><p>No About media frames attached.</p><span>Add up to three real images or videos. The public section uses clean branded placeholders until you publish media.</span></div>}
        </div>
      </section>
      <section className="admin-form-section admin-collection-section">
        <div className="admin-form-intro"><h2>Work experience</h2><p>Add current and past workplaces, roles, dates, locations, and a short description. Keep only information you want visitors to see.</p><button className="admin-add-button" type="button" onClick={addExperience} disabled={content.experiences.length >= 8}><Plus aria-hidden="true" />Add experience</button></div>
        <div className="admin-record-list">
          {content.experiences.length > 0 ? content.experiences.map((experience, index) => <fieldset className="admin-record" key={experience.id}>
            <legend>Experience {String(index + 1).padStart(2, "0")}</legend>
            <button className="admin-remove-button" type="button" onClick={() => removeExperience(experience.id)} aria-label={`Remove experience ${index + 1}`}><Trash2 aria-hidden="true" />Remove</button>
            <div className="admin-form-grid">
              <label><span>Workplace or practice</span><input value={experience.organization} onChange={(event) => updateExperience(experience.id, "organization", event.target.value)} /></label>
              <label><span>Role</span><input value={experience.role} onChange={(event) => updateExperience(experience.id, "role", event.target.value)} /></label>
              <label><span>Dates or period</span><input value={experience.period} placeholder="Example: 2024–Present" onChange={(event) => updateExperience(experience.id, "period", event.target.value)} /></label>
              <label><span>Location</span><input value={experience.location} placeholder="Example: Dhaka · Remote" onChange={(event) => updateExperience(experience.id, "location", event.target.value)} /></label>
              <label className="admin-field-wide"><span>What you did</span><textarea rows={4} value={experience.summary} onChange={(event) => updateExperience(experience.id, "summary", event.target.value)} /></label>
            </div>
          </fieldset>) : <div className="admin-record-empty"><p>No experience entries yet.</p><span>The public section will show a clear “being prepared” message until you add one.</span></div>}
        </div>
      </section>
      <section className="admin-form-section admin-collection-section">
        <div className="admin-form-intro"><h2>Testimonials</h2><p>Publish genuine feedback only after the person has approved the quote and credit. Empty fields will never create sample testimonials.</p><button className="admin-add-button" type="button" onClick={addTestimonial} disabled={content.testimonials.length >= 8}><Plus aria-hidden="true" />Add testimonial</button></div>
        <div className="admin-record-list">
          {content.testimonials.length > 0 ? content.testimonials.map((testimonial, index) => <fieldset className="admin-record" key={testimonial.id}>
            <legend>Testimonial {String(index + 1).padStart(2, "0")}</legend>
            <button className="admin-remove-button" type="button" onClick={() => removeTestimonial(testimonial.id)} aria-label={`Remove testimonial ${index + 1}`}><Trash2 aria-hidden="true" />Remove</button>
            <div className="admin-form-grid">
              <label className="admin-field-wide"><span>Approved quote</span><textarea rows={5} value={testimonial.quote} onChange={(event) => updateTestimonial(testimonial.id, "quote", event.target.value)} /></label>
              <label><span>Person’s name</span><input value={testimonial.name} onChange={(event) => updateTestimonial(testimonial.id, "name", event.target.value)} /></label>
              <label><span>Role (optional)</span><input value={testimonial.role} onChange={(event) => updateTestimonial(testimonial.id, "role", event.target.value)} /></label>
              <label><span>Company (optional)</span><input value={testimonial.company} onChange={(event) => updateTestimonial(testimonial.id, "company", event.target.value)} /></label>
              <label><span>Client media</span><select value={testimonial.mediaType} onChange={(event) => updateTestimonial(testimonial.id, "mediaType", event.target.value)}><option value="none">No media</option><option value="image">Image</option><option value="video">Video</option></select></label>
              <label className="admin-field-wide"><span>Secure media URL (optional)</span><input type="url" value={testimonial.mediaUrl} onChange={(event) => updateTestimonial(testimonial.id, "mediaUrl", event.target.value)} /></label>
              <label className="admin-field-wide"><span>Media description</span><input value={testimonial.mediaAlt} onChange={(event) => updateTestimonial(testimonial.id, "mediaAlt", event.target.value)} /></label>
            </div>
          </fieldset>) : <div className="admin-record-empty"><p>No testimonials published.</p><span>The public site will show an honest approved-feedback notice instead of a fake quote.</span></div>}
        </div>
      </section>
      <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy || uploadingPortrait || Boolean(uploadingAboutPhoto)}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save public content"}</button></div>
    </form>
  );
}
