"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { showreelMedia } from "@/lib/portfolio";

export function ShowreelLoop({ heading, intro, videoUrl = showreelMedia.videoUrl, posterUrl = showreelMedia.posterUrl }: { heading: string; intro: string; videoUrl?: string; posterUrl?: string }) {
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
      <div className="showreel-masthead" data-showreel-copy>
        <p className="eyebrow"><span>02</span>Selected motion / continuous loop</p>
        <p className="showreel-edition"><span>Orko Biswas</span><span>Visual designer · 2026</span></p>
      </div>

      <div className="showreel-stage">
        <h2 id="showreel-heading" className="showreel-type" data-showreel-title>
          <span className="sr-only">{heading}</span>
          <span className="showreel-type-sans" data-showreel-word aria-hidden="true">Show</span>
          <em data-showreel-word aria-hidden="true">reel</em>
          <small data-showreel-word aria-hidden="true">’26</small>
        </h2>

        <div className="showreel-media" data-showreel-frame>
          <video
            ref={video}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={posterUrl || undefined}
            aria-describedby="showreel-caption"
            data-showreel-video
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={videoUrl} />
          </video>
          <div className="showreel-wash" aria-hidden="true" />
          <p className="showreel-live" data-showreel-overlay><i />Playing in place</p>
          <button className="showreel-play" type="button" onClick={togglePlayback} aria-pressed={playing} data-showreel-overlay>
            <span>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />}</span>
            {playing ? "Pause reel" : "Play reel"}
          </button>
          <div className="showreel-progress" aria-hidden="true"><span data-showreel-progress /></div>
        </div>
      </div>

      <div className="showreel-details" data-showreel-details>
        <div className="showreel-statement">
          <strong>{heading}</strong>
          <p id="showreel-caption">{intro}</p>
        </div>
        <p className="showreel-meta"><span>Silent autoplay</span><span>Edit · Motion · Design</span><span>Loops while visible</span></p>
        <Link className="text-link light" href="/work">Explore the full archive <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
