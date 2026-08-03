"use client";

import { useEffect, useRef } from "react";

const heroVideo = "https://res.cloudinary.com/dbq2cv0an/video/upload/f_mp4,q_auto:good/twjrdvsw3twharx3w0kx.mp4";
const heroPoster = "https://res.cloudinary.com/dbq2cv0an/video/upload/so_0,f_jpg,q_auto:good/twjrdvsw3twharx3w0kx.jpg";

export function HeroMotionMedia() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      const root = document.documentElement;
      const shouldPause = motionPreference.matches || root.dataset.motion === "reduced" || root.dataset.data === "low";
      if (shouldPause) {
        element.pause();
        return;
      }
      void element.play().catch(() => undefined);
    };

    const observer = new MutationObserver(syncPlayback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "data-data"] });
    motionPreference.addEventListener("change", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <div className="hero-media" data-hero-media aria-hidden="true">
      <video ref={video} muted loop playsInline preload="metadata" poster={heroPoster} aria-hidden="true">
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="hero-media-wash" aria-hidden="true" />
    </div>
  );
}
