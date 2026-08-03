"use client";
/* eslint-disable @next/next/no-img-element -- Cloudinary URLs are dynamic owner-managed media. */

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Clipboard, CloudUpload, File, Image as ImageIcon, LoaderCircle, RefreshCw, Trash2, Video } from "lucide-react";
import type { CloudinaryAsset } from "@/lib/cloudinary";

type LibraryResponse = { ok?: boolean; configured?: boolean; missing?: string[]; assets?: CloudinaryAsset[]; message?: string };
type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

function assetIcon(type: CloudinaryAsset["resourceType"]) {
  if (type === "image") return ImageIcon;
  if (type === "video") return Video;
  return File;
}

export function AdminMediaLibrary({ initiallyConfigured, initialMissing }: { initiallyConfigured: boolean; initialMissing: string[] }) {
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [configured, setConfigured] = useState(initiallyConfigured);
  const [missing, setMissing] = useState(initialMissing);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true); setMessage("");
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const result = await response.json().catch(() => ({ message: "The media library could not be loaded." })) as LibraryResponse;
    if (response.ok && result.ok) {
      setAssets(result.assets ?? []); setConfigured(Boolean(result.configured)); setMissing(result.missing ?? []);
    } else setMessage(result.message ?? "The media library could not be loaded.");
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files);
    const tooLarge = selected.find((file) => file.size > 100 * 1024 * 1024);
    if (tooLarge) { setSuccess(false); setMessage(`${tooLarge.name} is larger than the 100 MB direct-upload limit.`); return; }
    setUploading(true); setSuccess(false); setMessage(""); setUploadProgress(0);
    try {
      for (let index = 0; index < selected.length; index += 1) {
        const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
        const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
        if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
        const form = new FormData();
        form.set("file", selected[index]);
        form.set("api_key", signed.apiKey);
        form.set("signature", signed.signature);
        for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/auto/upload`, { method: "POST", body: form });
        if (!uploadResponse.ok) throw new Error(`Cloudinary could not upload ${selected[index].name}.`);
        setUploadProgress(Math.round(((index + 1) / selected.length) * 100));
      }
      if (input.current) input.current.value = "";
      setSuccess(true); setMessage(`${selected.length} file${selected.length === 1 ? "" : "s"} uploaded successfully.`);
      await load();
    } catch (error) {
      setSuccess(false); setMessage(error instanceof Error ? error.message : "The upload could not be completed.");
    } finally { setUploading(false); }
  }

  async function copyUrl(url: string) {
    try { await navigator.clipboard.writeText(url); setSuccess(true); setMessage("Secure media URL copied."); }
    catch { setSuccess(false); setMessage("The URL could not be copied automatically."); }
  }

  async function remove(asset: CloudinaryAsset) {
    if (!window.confirm(`Permanently delete “${asset.publicId}” from Cloudinary? This cannot be undone unless Cloudinary backup is enabled.`)) return;
    setSuccess(false); setMessage("");
    const response = await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId: asset.publicId, resourceType: asset.resourceType }) });
    const result = await response.json().catch(() => ({ message: "The media item could not be deleted." })) as { ok?: boolean; message?: string };
    if (response.ok && result.ok) { setAssets((current) => current.filter((item) => item.assetId !== asset.assetId)); setSuccess(true); setMessage("Media item deleted from Cloudinary."); }
    else { setSuccess(false); setMessage(result.message ?? "The media item could not be deleted."); }
  }

  if (!configured) return <section className="admin-card admin-media-setup"><CloudUpload aria-hidden="true" /><div><p className="admin-kicker">Cloudinary connection</p><h2>One account value is still needed.</h2><p>The media workspace is ready, but uploads remain locked until every hosted value is configured.</p><code>{missing.join(" · ") || "Cloudinary configuration"}</code></div></section>;

  return <>
    <section className="admin-media-drop admin-card">
      <div><span><CloudUpload aria-hidden="true" /></span><p className="admin-kicker">Direct secure upload</p><h2>Store images, videos, audio, PDFs, and project files.</h2><p>Files go directly from this dashboard to the private Cloudinary connection. The website server never receives the file bytes.</p></div>
      <label className={uploading ? "is-busy" : ""}><input ref={input} type="file" multiple disabled={uploading} onChange={(event) => void uploadFiles(event.target.files)} /><CloudUpload aria-hidden="true" />{uploading ? `Uploading ${uploadProgress}%` : "Choose files"}</label>
      {uploading && <div className="admin-upload-progress" aria-label={`Upload ${uploadProgress}% complete`}><span style={{ width: `${uploadProgress}%` }} /></div>}
    </section>
    <div className="admin-media-toolbar"><div><strong>{assets.length}</strong><span>stored files</span></div><p className={success ? "is-success" : "is-error"} role="status">{success && message && <Check aria-hidden="true" />}{message}</p><button type="button" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "spin" : ""} aria-hidden="true" />Refresh</button></div>
    {loading ? <div className="admin-media-loading"><LoaderCircle className="spin" aria-hidden="true" />Loading media library…</div> : assets.length ? <section className="admin-media-grid" aria-label="Cloudinary media library">
      {assets.map((asset) => { const Icon = assetIcon(asset.resourceType); return <article className="admin-media-card" key={asset.assetId}>
        <div className="admin-media-preview">{asset.resourceType === "image" ? <img src={asset.secureUrl} alt={asset.publicId} loading="lazy" /> : asset.resourceType === "video" ? <video src={asset.secureUrl} controls muted preload="metadata" aria-label={asset.publicId} /> : <Icon aria-hidden="true" />}</div>
        <div className="admin-media-info"><div><span>{asset.resourceType} · {asset.format}</span><h3 title={asset.publicId}>{asset.publicId.split("/").at(-1)}</h3><p>{formatBytes(asset.bytes)}{asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}{asset.duration ? ` · ${Math.round(asset.duration)}s` : ""}</p></div><div className="admin-media-actions"><button type="button" onClick={() => void copyUrl(asset.secureUrl)}><Clipboard aria-hidden="true" />Copy URL</button><button className="is-danger" type="button" onClick={() => void remove(asset)} aria-label={`Delete ${asset.publicId}`}><Trash2 aria-hidden="true" /></button></div></div>
      </article>; })}
    </section> : <div className="admin-empty admin-media-empty"><CloudUpload aria-hidden="true" /><strong>Your Cloudinary library is ready.</strong><span>Upload the first file to start building your media collection.</span></div>}
  </>;
}
