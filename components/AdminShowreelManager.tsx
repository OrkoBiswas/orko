"use client";

import { useState } from "react";
import { Check, Film, Link2, LoaderCircle, RotateCcw, Save, Upload } from "lucide-react";
import { notifyAdmin } from "@/components/AdminNotificationCenter";

type ShowreelSettings = {
  showreelVideoUrl: string;
  showreelPosterUrl: string;
};

type SignatureResponse = {
  ok?: boolean;
  cloudName?: string;
  apiKey?: string;
  signature?: string;
  params?: Record<string, string>;
  message?: string;
};

type UploadResponse = {
  secure_url?: string;
  resource_type?: "video" | string;
  error?: { message?: string };
};

function posterFromVideo(url: string) {
  const marker = "/video/upload/";
  if (!url.includes(marker)) return "";
  const [path, suffix = ""] = url.split(/(?=[?#])/u, 2);
  const poster = path.replace(marker, `${marker}so_0,f_jpg,q_auto:good/`).replace(/\.[a-z0-9]+$/iu, ".jpg");
  return `${poster}${suffix}`;
}

export function AdminShowreelManager({ initial, defaults, cloudinaryConfigured }: { initial: ShowreelSettings; defaults: ShowreelSettings; cloudinaryConfigured: boolean }) {
  const [settings, setSettings] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  async function persist(next: ShowreelSettings, successMessage: string) {
    const response = await fetch("/api/admin/showreel", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const result = await response.json().catch(() => ({ message: "The showreel could not be published." })) as { ok?: boolean; message?: string };
    if (!response.ok || !result.ok) throw new Error(result.message ?? "The showreel could not be published.");
    setSettings(next);
    setSaved(true);
    setMessage(successMessage);
  }

  async function uploadShowreel(file?: File) {
    if (!file) return;
    const looksLikeVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/iu.test(file.name);
    if (!looksLikeVideo) {
      setSaved(false);
      setMessage("Choose a video file such as MP4, WebM, or MOV.");
      notifyAdmin({ tone: "error", title: "Video required", message: "Choose a supported video file for the showreel." });
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setSaved(false);
      setMessage("The showreel must be smaller than 100 MB.");
      notifyAdmin({ tone: "error", title: "File is too large", message: "Choose a showreel smaller than 100 MB." });
      return;
    }

    setUploading(true);
    setSaved(false);
    setMessage(`Uploading ${file.name}…`);
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");

      const form = new FormData();
      form.set("file", file);
      form.set("api_key", signed.apiKey);
      form.set("signature", signed.signature);
      for (const [key, value] of Object.entries(signed.params)) form.set(key, value);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/video/upload`, { method: "POST", body: form });
      const uploaded = await uploadResponse.json().catch(() => ({})) as UploadResponse;
      if (!uploadResponse.ok || !uploaded.secure_url || uploaded.resource_type !== "video") throw new Error(uploaded.error?.message ?? "Cloudinary could not upload this video.");

      const next = { showreelVideoUrl: uploaded.secure_url, showreelPosterUrl: posterFromVideo(uploaded.secure_url) };
      await persist(next, "New showreel uploaded and published.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The showreel could not be uploaded.";
      setSaved(false);
      setMessage(detail);
      notifyAdmin({ tone: "error", title: "Showreel not replaced", message: detail });
    } finally {
      setUploading(false);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setMessage("");
    try {
      await persist(settings, "Showreel URLs saved and published.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The showreel could not be published.");
    } finally {
      setSaving(false);
    }
  }

  async function restoreDefault() {
    setSaving(true);
    setSaved(false);
    setMessage("");
    try {
      await persist(defaults, "Original showreel restored and published.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The original showreel could not be restored.");
    } finally {
      setSaving(false);
    }
  }

  const busy = uploading || saving;

  return <div className="admin-showreel-workspace">
    <section className="admin-showreel-preview" aria-labelledby="showreel-preview-title">
      <div className="admin-showreel-preview-head"><div><p className="admin-kicker">Current public media</p><h2 id="showreel-preview-title">Showreel preview</h2></div><span><i /> Live on website</span></div>
      <video key={settings.showreelVideoUrl} src={settings.showreelVideoUrl} poster={settings.showreelPosterUrl || undefined} controls muted playsInline preload="metadata" aria-label="Current public showreel preview" />
      <div className="admin-showreel-preview-foot"><span><Film aria-hidden="true" /> Muted loop on the public section</span><a href="/#showreel" target="_blank" rel="noreferrer">View live section</a></div>
    </section>

    <form className="admin-editor admin-showreel-editor" onSubmit={save}>
      <section className="admin-form-section">
        <div className="admin-form-intro">
          <p className="admin-kicker">Upload or replace</p>
          <h2>Publish a new showreel</h2>
          <p>Select one video. It uploads directly to Cloudinary, creates a poster frame automatically, and replaces the public reel after the upload succeeds.</p>
          <label className={`admin-showreel-upload${!cloudinaryConfigured ? " is-disabled" : ""}`}>
            <input type="file" accept="video/mp4,video/webm,video/quicktime,video/*" disabled={busy || !cloudinaryConfigured} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; void uploadShowreel(file); }} />
            {uploading ? <LoaderCircle className="spin" aria-hidden="true" /> : <Upload aria-hidden="true" />}
            <span><strong>{uploading ? "Uploading showreel…" : "Choose replacement video"}</strong><small>MP4, WebM, or MOV · maximum 100 MB</small></span>
          </label>
          {!cloudinaryConfigured && <p className="admin-showreel-warning">Cloudinary uploads are unavailable until the protected account values are configured. Secure URL replacement still works.</p>}
        </div>

        <div className="admin-form-grid admin-showreel-fields">
          <label className="admin-field-wide"><span><Link2 aria-hidden="true" /> Secure showreel video URL</span><input required type="url" value={settings.showreelVideoUrl} onChange={(event) => { setSaved(false); setSettings((current) => ({ ...current, showreelVideoUrl: event.target.value })); }} /></label>
          <label className="admin-field-wide"><span>Poster image URL</span><input type="url" value={settings.showreelPosterUrl} onChange={(event) => { setSaved(false); setSettings((current) => ({ ...current, showreelPosterUrl: event.target.value })); }} /><small>Generated automatically after upload. You can replace it with another secure Cloudinary image.</small></label>
        </div>
      </section>

      <div className="admin-showreel-actions">
        <div>{message && <p className={saved ? "is-success" : "is-error"} role="status">{saved && <Check aria-hidden="true" />}{message}</p>}</div>
        <div><button className="admin-showreel-restore" type="button" disabled={busy} onClick={() => void restoreDefault()}><RotateCcw aria-hidden="true" />Restore original</button><button type="submit" disabled={busy}>{saving ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}{saving ? "Publishing…" : "Save & publish"}</button></div>
      </div>
    </form>
  </div>;
}
