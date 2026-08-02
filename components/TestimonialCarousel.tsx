"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Quote } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type Testimonial = SiteContent["testimonials"][number];
const slideDuration = 6000;

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [interactionPause, setInteractionPause] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const touchStart = useRef<number | null>(null);
  const canMove = testimonials.length > 1;
  const paused = manualPause || interactionPause || reducedMotion || !pageVisible;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches || document.documentElement.dataset.motion === "reduced");
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    motionQuery.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!canMove || paused) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % testimonials.length), slideDuration);
    return () => window.clearTimeout(timer);
  }, [active, canMove, paused, testimonials.length]);

  function move(direction: number) {
    setActive((current) => (current + direction + testimonials.length) % testimonials.length);
  }

  function finishSwipe(clientX: number) {
    if (touchStart.current === null) return;
    const distance = clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > 44) move(distance < 0 ? 1 : -1);
  }

  return (
    <div
      className={`testimonial-carousel${paused ? " is-paused" : ""}${reducedMotion ? " is-reduced" : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setInteractionPause(true)}
      onMouseLeave={() => setInteractionPause(false)}
      onFocusCapture={() => setInteractionPause(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPause(false); }}
    >
      <div className="testimonial-viewport" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
        <div className="testimonial-track" style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}>
          {testimonials.map((testimonial, index) => <figure className="testimonial-slide" key={testimonial.id} aria-hidden={index !== active}>
            <div className="testimonial-slide-mark"><Quote aria-hidden="true" /><span>{String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span></div>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <span className="testimonial-avatar" aria-hidden="true">{testimonial.name.slice(0, 1)}</span>
              <span><strong>{testimonial.name}</strong>{[testimonial.role, testimonial.company].filter(Boolean).length > 0 && <small>{[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}</small>}</span>
            </figcaption>
          </figure>)}
        </div>
      </div>
      <div className="testimonial-controls">
        <div className="testimonial-dots" aria-label="Choose testimonial">{testimonials.map((testimonial, index) => <button type="button" className={index === active ? "is-active" : ""} key={testimonial.id} onClick={() => setActive(index)} aria-label={`Show testimonial ${index + 1}`} aria-current={index === active ? "true" : undefined}><span /></button>)}</div>
        <div className="testimonial-progress" aria-hidden="true"><span key={`${active}-${paused}`} style={{ animationDuration: `${slideDuration}ms` }} /></div>
        <p aria-live="polite">{String(active + 1).padStart(2, "0")} <span>/</span> {String(testimonials.length).padStart(2, "0")}</p>
        {canMove && <div className="testimonial-buttons">
          <button type="button" onClick={() => setManualPause((current) => !current)} aria-label={manualPause ? "Play testimonial slideshow" : "Pause testimonial slideshow"}>{manualPause ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button>
          <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial"><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next testimonial"><ArrowRight aria-hidden="true" /></button>
        </div>}
      </div>
    </div>
  );
}
