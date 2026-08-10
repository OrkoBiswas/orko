"use client";
/* eslint-disable @next/next/no-img-element -- Owner-selected Cloudinary media is rendered from a validated secure URL. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Image as ImageIcon, Link2, LoaderCircle, RefreshCw, Trash2, Upload } from "lucide-react";
import { notifyAdmin } from "@/components/AdminNotificationCenter";
import type { CategoryThumbnail } from "@/lib/category-content";

type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };
type UploadResponse = { secure_url?: string; resource_type?: "image" | "video"; error?: { message?: string } };

const ratioOptions: Array<[CategoryThumbnail["ratio"], string]> = [
  ["wide", "Landscape · 16:9"],
  ["square", "Square · 1:1"],
  ["tall", "Portrait · 4:5"],
  ["vertical", "Vertical · 9:16"],
  ["banner", "Banner · 21:9"],
];

export function AdminCategoryThumbnail({ slug, label, initial }: { slug: string; label: string; initial?: CategoryThumbnail }) {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState(initial);
  const [ratio, setRatio] = useState<CategoryThumbnail["ratio"]>(initial?.ratio ?? "wide");
  const [urlInput, setUrlInput] = useState(initial?.mediaUrl ?? "");
  const [busy, setBusy] = useState(false);

  async function persist(media: Pick<CategoryThumbnail, "mediaUrl" | "mediaType" | "mediaAlt">, nextRatio = ratio) {
    const response = await fetch(`/api/admin/categories/${encodeURIComponent(slug)}/thumbnail`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, ...media, ratio: nextRatio }),
    });
    const result = await response.json().catch(() => ({ message: "The category thumbnail could not be saved." })) as { ok?: boolean; thumbnail?: CategoryThumbnail; message?: string };
    if (!response.ok || !result.ok || !result.thumbnail) throw new Error(result.message ?? "The category thumbnail could not be saved.");
    setThumbnail(result.thumbnail);
    setRatio(result.thumbnail.ratio);
    router.refresh();
  }

  async function upload(file: File) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      notifyAdmin({ tone: "error", title: "Thumbnail not uploaded", message: "Choose an image or video file." });
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      notifyAdmin({ tone: "error", title: "Thumbnail not uploaded", message: "Choose a file smaller than 100 MB." });
      return;
    }
    setBusy(true);
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      const form = new FormData();
      form.set("file", file);
      form.set("api_key", signed.apiKey);
      form.set("signature", signed.signature);
      for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/auto/upload`, { method: "POST", body: form });
      const uploaded = await uploadResponse.json().catch(() => ({})) as UploadResponse;
      if (!uploadResponse.ok || !uploaded.secure_url || !uploaded.resource_type) throw new Error(uploaded.error?.message ?? "The file could not be uploaded.");
      await persist({ mediaUrl: uploaded.secure_url, mediaType: uploaded.resource_type, mediaAlt: `${label} category thumbnail` });
      setUrlInput(uploaded.secure_url);
      notifyAdmin({ tone: "success", title: thumbnail ? "Category thumbnail replaced" : "Category thumbnail attached", message: `${label} now has its own public cover.` });
    } catch (error) {
      notifyAdmin({ tone: "error", title: "Thumbnail not uploaded", message: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function saveUrl() {
    const mediaUrl = urlInput.trim();
    let mediaType: "image" | "video";
    try {
      const url = new URL(mediaUrl);
      if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") throw new Error("Paste a secure Cloudinary delivery URL.");
      const path = url.pathname.toLowerCase();
      mediaType = path.includes("/video/upload/") || /\.(mp4|webm|mov|m4v)(?:$|[?#])/.test(path) ? "video" : "image";
    } catch {
      notifyAdmin({ tone: "error", title: "URL not saved", message: "Paste a valid secure Cloudinary image or video URL." });
      return;
    }
    setBusy(true);
    try {
      await persist({ mediaUrl, mediaType, mediaAlt: `${label} category thumbnail` });
      setUrlInput(mediaUrl);
      notifyAdmin({ tone: "success", title: thumbnail ? "Category URL replaced" : "Category URL attached", message: `${label} now uses this ${mediaType} as its public cover.` });
    } catch (error) {
      notifyAdmin({ tone: "error", title: "URL not saved", message: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function changeRatio(nextRatio: CategoryThumbnail["ratio"]) {
    setRatio(nextRatio);
    if (!thumbnail) return;
    setBusy(true);
    try {
      await persist({ mediaUrl: thumbnail.mediaUrl, mediaType: thumbnail.mediaType, mediaAlt: thumbnail.mediaAlt }, nextRatio);
      notifyAdmin({ tone: "success", title: "Category format updated", message: `${label} will use the new thumbnail shape.` });
    } catch (error) {
      setRatio(thumbnail.ratio);
      notifyAdmin({ tone: "error", title: "Format not saved", message: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(slug)}/thumbnail`, { method: "DELETE" });
      const result = await response.json().catch(() => ({ message: "The category thumbnail could not be removed." })) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "The category thumbnail could not be removed.");
      setThumbnail(undefined);
      setUrlInput("");
      router.refresh();
      notifyAdmin({ tone: "success", title: "Category thumbnail removed", message: "The uploaded file remains safe in the media library." });
    } catch (error) {
      notifyAdmin({ tone: "error", title: "Thumbnail not removed", message: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return <div className="admin-category-thumbnail">
    <div className={`admin-category-thumbnail-preview ratio-${ratio}`}>
      {thumbnail ? thumbnail.mediaType === "video" ? <video src={thumbnail.mediaUrl} muted controls playsInline preload="metadata" aria-label={thumbnail.mediaAlt} /> : <img src={thumbnail.mediaUrl} alt={thumbnail.mediaAlt} /> : <div><ImageIcon aria-hidden="true" /><span>No category thumbnail</span></div>}
      {busy && <span className="admin-category-thumbnail-busy"><LoaderCircle className="spin" aria-hidden="true" /> Saving</span>}
    </div>
    <label className="admin-category-ratio"><span>Frame</span><select value={ratio} disabled={busy} onChange={(event) => void changeRatio(event.target.value as CategoryThumbnail["ratio"])}>{ratioOptions.map(([value, copy]) => <option value={value} key={value}>{copy}</option>)}</select></label>
    <div className="admin-category-url">
      <label htmlFor={`category-thumbnail-url-${slug}`}>Cloudinary URL</label>
      <div><input id={`category-thumbnail-url-${slug}`} type="url" inputMode="url" placeholder="https://res.cloudinary.com/…" value={urlInput} disabled={busy} onChange={(event) => setUrlInput(event.target.value)} /><button type="button" disabled={busy || !urlInput.trim()} onClick={() => void saveUrl()}><Link2 aria-hidden="true" /> Use URL</button></div>
      <small>Paste an image or video delivery URL from Cloudinary.</small>
    </div>
    <div className="admin-category-thumbnail-actions">
      <label><input type="file" accept="image/*,video/*" disabled={busy} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file) void upload(file); }} />{thumbnail ? <RefreshCw aria-hidden="true" /> : <Upload aria-hidden="true" />}{thumbnail ? "Replace" : "Attach thumbnail"}</label>
      {thumbnail && <button type="button" disabled={busy} onClick={() => void remove()}><Trash2 aria-hidden="true" /> Remove</button>}
      <Link href="/admin/media" target="_blank"><ImageIcon aria-hidden="true" /> Library</Link>
    </div>
  </div>;
}
