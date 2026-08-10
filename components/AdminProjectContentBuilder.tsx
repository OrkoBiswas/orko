"use client";
/* eslint-disable @next/next/no-img-element -- Owner-selected Cloudinary media is previewed directly. */

import { useState } from "react";
import {
  Aperture,
  ArrowDown,
  ArrowUp,
  Box,
  CirclePlay,
  Code2,
  Grid3X3,
  Image as ImageIcon,
  Link2,
  Minus,
  MousePointer2,
  Paperclip,
  Palette,
  Settings2,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { notifyAdmin } from "@/components/AdminNotificationCenter";
import type { ProjectAsset, ProjectContentBlock, ProjectCustomCta, ProjectPresentation } from "@/lib/portfolio";

type SignatureResponse = { ok?: boolean; cloudName?: string; apiKey?: string; signature?: string; params?: Record<string, string>; message?: string };
type UploadResponse = { secure_url?: string; resource_type?: "image" | "video" | "raw"; original_filename?: string; error?: { message?: string } };
type UploadedFile = { url: string; type: "image" | "video" | "raw"; inputType: "image" | "video" | "audio" | "other"; name: string };

type Props = {
  projectTitle: string;
  blocks: ProjectContentBlock[];
  presentation: ProjectPresentation;
  customCta: ProjectCustomCta;
  assets: ProjectAsset[];
  onBlocksChange: (blocks: ProjectContentBlock[]) => void;
  onPresentationChange: (presentation: ProjectPresentation) => void;
  onCustomCtaChange: (customCta: ProjectCustomCta) => void;
  onAssetsChange: (assets: ProjectAsset[]) => void;
};

const widthOptions = [
  ["compact", "Compact"],
  ["standard", "Standard"],
  ["wide", "Wide"],
  ["full", "Full bleed"],
] as const;

const palette = [
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "text", label: "Text", icon: Type },
  { type: "photo-grid", label: "Photo Grid", icon: Grid3X3 },
  { type: "video-audio", label: "Video / Audio", icon: CirclePlay },
  { type: "embed", label: "Embed", icon: Code2 },
  { type: "lightroom", label: "Lightroom", icon: Aperture },
  { type: "prototype", label: "Prototype", icon: MousePointer2 },
  { type: "3d", label: "3D", icon: Box },
  { type: "divider", label: "Space / Divider", icon: Minus },
] as const satisfies ReadonlyArray<{ type: ProjectContentBlock["type"]; label: string; icon: typeof ImageIcon }>;

function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

function defaultBlock(type: ProjectContentBlock["type"]): ProjectContentBlock {
  const id = makeId("project-block");
  if (type === "image") return { id, type, width: "wide", url: "", alt: "", caption: "" };
  if (type === "text") return { id, type, width: "standard", style: "body", align: "left", heading: "", body: "" };
  if (type === "photo-grid") return { id, type, width: "wide", columns: 2, gap: "small", items: [] };
  if (type === "video-audio") return { id, type, width: "wide", mediaType: "video", url: "", posterUrl: "", alt: "", caption: "" };
  if (type === "embed") return { id, type, width: "wide", url: "", title: "", caption: "" };
  if (type === "lightroom") return { id, type, width: "wide", beforeUrl: "", afterUrl: "", alt: "", caption: "" };
  if (type === "prototype" || type === "3d") return { id, type, width: "wide", url: "", title: "", description: "" };
  return { id, type: "divider", width: "standard", size: "medium" };
}

function blockName(block: ProjectContentBlock) {
  return palette.find((item) => item.type === block.type)?.label ?? "Content";
}

function blockSummary(block: ProjectContentBlock) {
  if (block.type === "image") return block.url ? "Image ready" : "Choose an image";
  if (block.type === "text") return block.heading || block.body.slice(0, 54) || "Write your text";
  if (block.type === "photo-grid") return `${block.items.length} photo${block.items.length === 1 ? "" : "s"}`;
  if (block.type === "video-audio") return block.url ? `${block.mediaType} ready` : `Choose ${block.mediaType}`;
  if (block.type === "embed") return block.title || (block.url ? "Embed ready" : "Add a link");
  if (block.type === "lightroom") return block.beforeUrl && block.afterUrl ? "Before and after ready" : "Add before and after";
  if (block.type === "prototype" || block.type === "3d") return block.title || (block.url ? "Link ready" : "Add a link");
  if (block.type === "divider") return `${block.size} space`;
  return "Content block";
}

function WidthSelect({ block, patch }: { block: ProjectContentBlock; patch: (patch: Partial<ProjectContentBlock>) => void }) {
  return <label><span>Content width</span><select value={block.width} onChange={(event) => patch({ width: event.target.value as ProjectContentBlock["width"] })}>{widthOptions.filter(([value]) => block.type !== "text" && block.type !== "divider" || value !== "full").map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>;
}

export function AdminProjectContentBuilder({ projectTitle, blocks, presentation, customCta, assets, onBlocksChange, onPresentationChange, onCustomCtaChange, onAssetsChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [openBlockId, setOpenBlockId] = useState<string | null>(blocks.at(-1)?.id ?? null);

  function patchBlock(id: string, patch: Partial<ProjectContentBlock>) {
    onBlocksChange(blocks.map((block) => block.id === id ? { ...block, ...patch } as ProjectContentBlock : block));
  }

  function moveBlock(index: number, offset: -1 | 1) {
    const destination = index + offset;
    if (destination < 0 || destination >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[destination]] = [next[destination], next[index]];
    onBlocksChange(next);
  }

  function addBlock(type: ProjectContentBlock["type"]) {
    const block = defaultBlock(type);
    onBlocksChange([...blocks, block]);
    setOpenBlockId(block.id);
  }

  function openSettings(id: string) {
    const target = document.getElementById(id);
    if (target instanceof HTMLDetailsElement) target.open = true;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function upload(files: File[], allowed: "image" | "media" | "asset"): Promise<UploadedFile[]> {
    const selected = files.slice(0, 12);
    if (!selected.length) return [];
    const invalid = selected.find((file) => allowed === "image" ? !file.type.startsWith("image/") : allowed === "media" ? !file.type.startsWith("video/") && !file.type.startsWith("audio/") : false);
    if (invalid) throw new Error(allowed === "image" ? "Choose image files only." : "That file type is not supported here.");
    const oversized = selected.find((file) => file.size > 100 * 1024 * 1024);
    if (oversized) throw new Error(`${oversized.name} is larger than the 100 MB upload limit.`);
    setUploading(true);
    setStatus(`Preparing ${selected.length} file${selected.length === 1 ? "" : "s"}…`);
    try {
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST" });
      const signed = await signatureResponse.json().catch(() => ({ message: "Upload authorization failed." })) as SignatureResponse;
      if (!signatureResponse.ok || !signed.ok || !signed.cloudName || !signed.apiKey || !signed.signature || !signed.params) throw new Error(signed.message ?? "Upload authorization failed.");
      const uploadedFiles: UploadedFile[] = [];
      for (const [index, file] of selected.entries()) {
        setStatus(`Uploading ${index + 1} of ${selected.length}: ${file.name}`);
        const form = new FormData();
        form.set("file", file);
        form.set("api_key", signed.apiKey);
        form.set("signature", signed.signature);
        for (const [key, value] of Object.entries(signed.params)) form.set(key, value);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/auto/upload`, { method: "POST", body: form });
        const result = await response.json().catch(() => ({})) as UploadResponse;
        if (!response.ok || !result.secure_url || !result.resource_type) throw new Error(result.error?.message ?? `${file.name} could not be uploaded.`);
        const inputType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "other";
        uploadedFiles.push({ url: result.secure_url, type: result.resource_type, inputType, name: result.original_filename || file.name.replace(/\.[^.]+$/, "") });
      }
      notifyAdmin({ tone: "success", title: "Content uploaded", message: `${uploadedFiles.length} file${uploadedFiles.length === 1 ? " is" : "s are"} ready in the project builder.` });
      return uploadedFiles;
    } finally {
      setUploading(false);
      setStatus("");
    }
  }

  async function handleUpload(files: File[], allowed: "image" | "media" | "asset", complete: (files: UploadedFile[]) => void) {
    try {
      const uploaded = await upload(files, allowed);
      complete(uploaded);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The upload could not be completed.";
      setStatus(message);
      notifyAdmin({ tone: "error", title: "Upload not completed", message });
    }
  }

  return <section className="admin-form-section admin-project-builder-section">
    <div className="admin-builder-sidebar">
      <div className="admin-builder-panel">
        <div className="admin-builder-panel-title"><strong>Add content</strong><span>{blocks.length} blocks</span></div>
        <div className="admin-content-palette">{palette.map(({ type, label, icon: Icon }) => <button type="button" key={type} onClick={() => addBlock(type)}><Icon aria-hidden="true" /><span>{label}</span></button>)}</div>
      </div>
      <div className="admin-builder-panel">
        <div className="admin-builder-panel-title"><strong>Edit project</strong></div>
        <div className="admin-content-palette is-two">
          <button type="button" aria-controls="project-style-settings" onClick={() => openSettings("project-style-settings")}><Palette aria-hidden="true" /><span>Styles</span></button>
          <button type="button" aria-controls="project-link-settings" onClick={() => openSettings("project-link-settings")}><Settings2 aria-hidden="true" /><span>Button</span></button>
        </div>
      </div>
      <div className="admin-builder-panel admin-asset-panel">
        <div className="admin-builder-panel-title"><strong>Attach assets</strong></div>
        <label className="admin-builder-upload"><input type="file" multiple disabled={uploading || assets.length >= 20} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void handleUpload(files.slice(0, 20 - assets.length), "asset", (uploaded) => onAssetsChange([...assets, ...uploaded.map((file) => ({ id: makeId("project-asset"), name: file.name, description: "", url: file.url }))])); }} /><Paperclip aria-hidden="true" /> Attach files</label>
        <p>Optional downloadable files such as fonts, templates, illustrations, or source previews.</p>
      </div>
      {status && <p className="admin-builder-status" role="status">{status}</p>}
    </div>

    <div className="admin-builder-main">
      <div className="admin-builder-heading"><div><p className="admin-kicker">Project canvas</p><h2>Add, arrange, publish.</h2></div><p>Choose a content type, add your work, then drag the story into order with the arrow controls. Your category thumbnail stays separate.</p></div>
      <div className="admin-content-stack">
        {blocks.map((block, index) => {
          const isOpen = openBlockId === block.id;
          return <article className={`admin-content-block${isOpen ? " is-open" : ""}`} key={block.id}>
          <header><button className="admin-block-toggle" type="button" onClick={() => setOpenBlockId(isOpen ? null : block.id)} aria-expanded={isOpen} aria-controls={`project-block-${block.id}`}><span>{String(index + 1).padStart(2, "0")}</span><span><strong>{blockName(block)}</strong><small>{blockSummary(block)}</small></span><span aria-hidden="true">{isOpen ? "Close" : "Edit"}</span></button><div><button type="button" disabled={index === 0} onClick={() => moveBlock(index, -1)} aria-label={`Move ${blockName(block)} block earlier`}><ArrowUp aria-hidden="true" /></button><button type="button" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)} aria-label={`Move ${blockName(block)} block later`}><ArrowDown aria-hidden="true" /></button><button type="button" className="is-remove" onClick={() => onBlocksChange(blocks.filter((item) => item.id !== block.id))} aria-label={`Remove ${blockName(block)} block`}><Trash2 aria-hidden="true" /></button></div></header>
          {isOpen && <div className="admin-content-block-fields" id={`project-block-${block.id}`}>
            {block.type !== "divider" && <WidthSelect block={block} patch={(patch) => patchBlock(block.id, patch)} />}
            {block.type === "image" && <>
              <label className="admin-field-wide"><span>Image URL</span><input type="url" value={block.url} placeholder="https://res.cloudinary.com/…" onChange={(event) => patchBlock(block.id, { url: event.target.value })} /></label>
              <label className="admin-builder-upload"><input type="file" accept="image/*" disabled={uploading} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void handleUpload(files, "image", ([file]) => file && patchBlock(block.id, { url: file.url })); }} /><Upload aria-hidden="true" /> Upload image</label>
              <label className="admin-field-wide"><span>Image description</span><input value={block.alt} placeholder="Describe the visible work" onChange={(event) => patchBlock(block.id, { alt: event.target.value })} /></label>
              <label className="admin-field-wide"><span>Optional caption</span><input value={block.caption} onChange={(event) => patchBlock(block.id, { caption: event.target.value })} /></label>
              {block.url && <img className="admin-block-preview" src={block.url} alt={block.alt || "Project image preview"} />}
            </>}
            {block.type === "text" && <>
              <label><span>Text style</span><select value={block.style} onChange={(event) => patchBlock(block.id, { style: event.target.value as typeof block.style })}><option value="heading">Large heading</option><option value="body">Body copy</option><option value="quote">Quote</option></select></label>
              <label><span>Alignment</span><select value={block.align} onChange={(event) => patchBlock(block.id, { align: event.target.value as typeof block.align })}><option value="left">Left</option><option value="center">Center</option></select></label>
              <label className="admin-field-wide"><span>Optional heading</span><input value={block.heading} onChange={(event) => patchBlock(block.id, { heading: event.target.value })} /></label>
              <label className="admin-field-wide"><span>Text</span><textarea rows={7} value={block.body} onChange={(event) => patchBlock(block.id, { body: event.target.value })} /></label>
            </>}
            {block.type === "photo-grid" && <>
              <label><span>Columns</span><select value={block.columns} onChange={(event) => patchBlock(block.id, { columns: Number(event.target.value) as 2 | 3 })}><option value="2">2 columns</option><option value="3">3 columns</option></select></label>
              <label><span>Gap</span><select value={block.gap} onChange={(event) => patchBlock(block.id, { gap: event.target.value as typeof block.gap })}><option value="none">No gap</option><option value="small">Small</option><option value="medium">Medium</option></select></label>
              <label className="admin-builder-upload"><input type="file" accept="image/*" multiple disabled={uploading || block.items.length >= 12} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void handleUpload(files.slice(0, 12 - block.items.length), "image", (uploaded) => patchBlock(block.id, { items: [...block.items, ...uploaded.map((file) => ({ id: makeId("grid-image"), url: file.url, alt: `${projectTitle} — ${file.name}` }))] })); }} /><Upload aria-hidden="true" /> Add photos</label>
              <div className="admin-grid-image-list">{block.items.map((item, itemIndex) => <div key={item.id}><img src={item.url} alt={item.alt || `Grid image ${itemIndex + 1}`} /><label><span>Description</span><input value={item.alt} onChange={(event) => patchBlock(block.id, { items: block.items.map((current) => current.id === item.id ? { ...current, alt: event.target.value } : current) })} /></label><button type="button" onClick={() => patchBlock(block.id, { items: block.items.filter((current) => current.id !== item.id) })}><Trash2 aria-hidden="true" /> Remove</button></div>)}</div>
            </>}
            {block.type === "video-audio" && <>
              <label><span>Media type</span><select value={block.mediaType} onChange={(event) => patchBlock(block.id, { mediaType: event.target.value as typeof block.mediaType })}><option value="video">Video</option><option value="audio">Audio</option></select></label>
              <label className="admin-field-wide"><span>Media URL</span><input type="url" value={block.url} onChange={(event) => patchBlock(block.id, { url: event.target.value })} /></label>
              <label className="admin-builder-upload"><input type="file" accept="video/*,audio/*" disabled={uploading} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void handleUpload(files, "media", ([file]) => file && patchBlock(block.id, { url: file.url, mediaType: file.inputType === "audio" ? "audio" : "video" })); }} /><Upload aria-hidden="true" /> Upload media</label>
              <label className="admin-field-wide"><span>Description</span><input value={block.alt} onChange={(event) => patchBlock(block.id, { alt: event.target.value })} /></label>
              <label className="admin-field-wide"><span>Optional caption</span><input value={block.caption} onChange={(event) => patchBlock(block.id, { caption: event.target.value })} /></label>
              {block.url && (block.mediaType === "video" ? <video className="admin-block-preview" src={block.url} controls muted preload="metadata" /> : <audio className="admin-block-audio" src={block.url} controls />)}
            </>}
            {block.type === "embed" && <><label className="admin-field-wide"><span>Supported embed URL</span><input type="url" value={block.url} placeholder="YouTube, Vimeo, Figma, or Sketchfab URL" onChange={(event) => patchBlock(block.id, { url: event.target.value })} /></label><label className="admin-field-wide"><span>Title</span><input value={block.title} onChange={(event) => patchBlock(block.id, { title: event.target.value })} /></label><label className="admin-field-wide"><span>Caption</span><input value={block.caption} onChange={(event) => patchBlock(block.id, { caption: event.target.value })} /></label></>}
            {block.type === "lightroom" && <>
              <div className="admin-lightroom-input"><label><span>Before image URL</span><input type="url" value={block.beforeUrl} onChange={(event) => patchBlock(block.id, { beforeUrl: event.target.value })} /></label><label className="admin-builder-upload"><input type="file" accept="image/*" disabled={uploading} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void handleUpload(files, "image", ([file]) => file && patchBlock(block.id, { beforeUrl: file.url })); }} /><Upload aria-hidden="true" /> Upload before</label></div>
              <div className="admin-lightroom-input"><label><span>After image URL</span><input type="url" value={block.afterUrl} onChange={(event) => patchBlock(block.id, { afterUrl: event.target.value })} /></label><label className="admin-builder-upload"><input type="file" accept="image/*" disabled={uploading} onChange={(event) => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; void handleUpload(files, "image", ([file]) => file && patchBlock(block.id, { afterUrl: file.url })); }} /><Upload aria-hidden="true" /> Upload after</label></div>
              <label className="admin-field-wide"><span>Description</span><input value={block.alt} onChange={(event) => patchBlock(block.id, { alt: event.target.value })} /></label><label className="admin-field-wide"><span>Caption</span><input value={block.caption} onChange={(event) => patchBlock(block.id, { caption: event.target.value })} /></label>
            </>}
            {(block.type === "prototype" || block.type === "3d") && <><label className="admin-field-wide"><span>{block.type === "prototype" ? "Prototype" : "3D presentation"} URL</span><input type="url" value={block.url} onChange={(event) => patchBlock(block.id, { url: event.target.value })} /></label><label className="admin-field-wide"><span>Title</span><input value={block.title} onChange={(event) => patchBlock(block.id, { title: event.target.value })} /></label><label className="admin-field-wide"><span>Description</span><textarea rows={3} value={block.description} onChange={(event) => patchBlock(block.id, { description: event.target.value })} /></label></>}
            {block.type === "divider" && <label><span>Space size</span><select value={block.size} onChange={(event) => patchBlock(block.id, { size: event.target.value as typeof block.size })}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>}
          </div>}
        </article>})}
        {!blocks.length && <div className="admin-builder-empty"><ImageIcon aria-hidden="true" /><h3>Your project is ready to build.</h3><p>Choose Image, Text, Photo Grid, Video / Audio, Embed, or another content type. The first block becomes the top of the opened project.</p></div>}
      </div>

      <details className="admin-builder-settings" id="project-style-settings"><summary><Palette aria-hidden="true" /><span><strong>Presentation styles</strong><small>Background, width, and spacing</small></span><span>Open</span></summary><div className="admin-content-block-fields"><label><span>Background</span><input type="color" value={presentation.background} onChange={(event) => onPresentationChange({ ...presentation, background: event.target.value })} /></label><label><span>Text color</span><input type="color" value={presentation.textColor} onChange={(event) => onPresentationChange({ ...presentation, textColor: event.target.value })} /></label><label><span>Maximum width</span><select value={presentation.contentWidth} onChange={(event) => onPresentationChange({ ...presentation, contentWidth: event.target.value as ProjectPresentation["contentWidth"] })}><option value="standard">Standard</option><option value="wide">Wide</option><option value="full">Full viewport</option></select></label><label><span>Vertical spacing</span><select value={presentation.spacing} onChange={(event) => onPresentationChange({ ...presentation, spacing: event.target.value as ProjectPresentation["spacing"] })}><option value="compact">Compact</option><option value="balanced">Balanced</option><option value="airy">Airy</option></select></label></div></details>

      <details className="admin-builder-settings" id="project-link-settings"><summary><Link2 aria-hidden="true" /><span><strong>Custom project button</strong><small>Optional link at the end</small></span><span>Open</span></summary><div className="admin-content-block-fields"><label className="admin-check"><input type="checkbox" checked={customCta.enabled} onChange={(event) => onCustomCtaChange({ ...customCta, enabled: event.target.checked })} /><span>Show custom button</span></label><label><span>Button label</span><input value={customCta.label} onChange={(event) => onCustomCtaChange({ ...customCta, label: event.target.value })} /></label><label className="admin-field-wide"><span>Secure destination URL</span><input type="url" value={customCta.url} onChange={(event) => onCustomCtaChange({ ...customCta, url: event.target.value })} /></label></div></details>

      {assets.length > 0 && <details className="admin-builder-settings"><summary><Paperclip aria-hidden="true" /><span><strong>Attached assets</strong><small>{assets.length} downloadable file{assets.length === 1 ? "" : "s"}</small></span><span>Open</span></summary><div className="admin-asset-list">{assets.map((asset) => <article key={asset.id}><label><span>File name</span><input value={asset.name} onChange={(event) => onAssetsChange(assets.map((current) => current.id === asset.id ? { ...current, name: event.target.value } : current))} /></label><label><span>Description</span><input value={asset.description} onChange={(event) => onAssetsChange(assets.map((current) => current.id === asset.id ? { ...current, description: event.target.value } : current))} /></label><button type="button" onClick={() => onAssetsChange(assets.filter((current) => current.id !== asset.id))}><Trash2 aria-hidden="true" /> Remove</button></article>)}</div></details>}
    </div>
  </section>;
}
