"use client";

import { useState } from "react";
import { Check, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type ScalarSiteContentKey = { [Key in keyof SiteContent]: SiteContent[Key] extends string ? Key : never }[keyof SiteContent];
type Experience = SiteContent["experiences"][number];
type Testimonial = SiteContent["testimonials"][number];

const groups: Array<{ title: string; description: string; fields: Array<[ScalarSiteContentKey, string, "text" | "email" | "url" | "textarea"]> }> = [
  { title: "Identity", description: "The name and positioning used across navigation, metadata, and profile pages.", fields: [["name","Public name","text"],["monogram","Monogram","text"],["title","Professional title","text"],["shortTitle","Short descriptor","text"]] },
  { title: "Homepage hero", description: "The first message visitors see and the primary hiring signal.", fields: [["headline","Accessible headline","text"],["heroLineOne","Headline — first line","text"],["heroLineTwo","Headline — accent line","text"],["intro","Opening introduction","textarea"],["availability","Availability","text"],["location","Location","text"],["timezone","Timezone","text"],["responseTime","Response time","text"]] },
  { title: "Homepage sections", description: "Editorial messaging for the work library, showreel, capabilities, experience, and testimonial sections.", fields: [["workHeading","Work heading","text"],["workIntro","Work introduction","textarea"],["showreelHeading","Showreel heading","text"],["showreelIntro","Showreel introduction","textarea"],["capabilitiesHeading","Capabilities heading","text"],["capabilitiesIntro","Capabilities introduction","textarea"],["experienceHeading","Experience heading","text"],["experienceIntro","Experience introduction","textarea"],["testimonialsHeading","Testimonials heading","text"],["testimonialsIntro","Testimonials introduction","textarea"]] },
  { title: "Profile & contact", description: "Public biography, direct contact, social profiles, and calls to action.", fields: [["biography","Biography","textarea"],["email","Contact email","email"],["primaryCta","Primary button label","text"],["secondaryCta","Secondary button label","text"],["instagram","Instagram URL","url"],["linkedin","LinkedIn URL","url"],["behance","Behance URL","url"]] },
  { title: "Search visibility", description: "Default title and description used when the portfolio is shared or discovered.", fields: [["seoTitle","SEO title","text"],["seoDescription","SEO description","textarea"]] },
];

function recordId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

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
      <div className="admin-save-bar"><div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div><button type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{busy ? "Saving…" : "Save public content"}</button></div>
    </form>
  );
}
