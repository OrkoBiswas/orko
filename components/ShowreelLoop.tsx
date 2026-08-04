"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { showreelMedia } from "@/lib/portfolio";

export function ShowreelLoop({ heading, intro }: { heading: string; intro: string }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const sectionElement = section.current;
    const videoElement = video.current;
    if (!sectionElement || !videoElement) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;

    const syncPlayback = () => {
      const root = document.documentElement;
      const shouldPause = !isVisible || document.hidden || manuallyPaused.current || motionPreference.matches || root.dataset.motion === "reduced" || root.dataset.data === "low";
      if (shouldPause) {
        videoElement.pause();
        return;
      }
      void videoElement.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.28;
      syncPlayback();
    }, { threshold: [0, 0.28, 0.65], rootMargin: "8% 0px" });
    const settingsObserver = new MutationObserver(syncPlayback);

    observer.observe(sectionElement);
    settingsObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "data-data"] });
    motionPreference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      settingsObserver.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  const togglePlayback = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      manuallyPaused.current = false;
      void element.play().catch(() => undefined);
    } else {
      manuallyPaused.current = true;
      element.pause();
    }
  };

  return (
    <section ref={section} id="showreel" className="showreel-section section-shell" data-showreel-sequence aria-labelledby="showreel-heading">
      <div className="showreel-loop-grid">
        <div className="showreel-copy" data-showreel-copy>
          <p className="eyebrow"><span>02</span>Showreel / continuous loop</p>
          <h2 id="showreel-heading">{heading}</h2>
          <p>{intro}</p>
          <div className="showreel-actions">
            <button className="showreel-play" type="button" onClick={togglePlayback} aria-pressed={playing}>
              <span>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />}</span>
              {playing ? "Pause reel" : "Play reel"}
            </button>
            <Link className="text-link light" href="/work">Explore the full archive <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <dl className="showreel-facts">
            <div><dt>Format</dt><dd>Silent loop</dd></div>
            <div><dt>Focus</dt><dd>Edit · Motion · Design</dd></div>
          </dl>
        </div>

        <div className="showreel-frame" data-showreel-frame>
          <video
            ref={video}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={showreelMedia.posterUrl}
            aria-describedby="showreel-caption"
            data-showreel-video
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={showreelMedia.videoUrl} type="video/mp4" />
          </video>
          <div className="showreel-wash" aria-hidden="true" />
          <div className="showreel-frame-top" data-showreel-overlay>
            <span><i />Playing in place</span>
            <span>OB / 2026</span>
          </div>
          <div className="showreel-watermark" aria-hidden="true">OB</div>
          <div className="showreel-frame-bottom" data-showreel-overlay>
            <p id="showreel-caption"><strong>{showreelMedia.label}</strong><span>No popup · Muted autoplay · Loops continuously</span></p>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="showreel-progress" aria-hidden="true"><span data-showreel-progress /></div>
        </div>
      </div>
    </section>
  );
}
