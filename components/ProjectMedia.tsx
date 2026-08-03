"use client";
/* eslint-disable @next/next/no-img-element -- Project sources are dynamic Cloudinary delivery URLs. */

import { useEffect, useRef } from "react";

export function ProjectMedia({ url, type, alt, controls = false }: { url: string; type: "image" | "video"; alt: string; controls?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (type !== "video" || !video.current) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (!video.current) return;
      if (media.matches) video.current.pause();
      else void video.current.play().catch(() => undefined);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [type, url]);

  if (type === "video") return <video ref={video} className="project-media" src={url} muted loop playsInline controls={controls} preload="metadata" aria-label={alt} />;
  return <img className="project-media" src={url} alt={alt} loading="lazy" />;
}
