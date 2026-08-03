"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion) return;

    const root = cursor.current;
    const ringElement = ring.current;
    const dotElement = dot.current;
    if (!root || !ringElement || !dotElement) return;

    const place = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const setMode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const nativeControl = element?.closest("input, textarea, select, video[controls], iframe, [contenteditable='true'], [data-native-cursor]");
      const interactive = element?.closest<HTMLElement>("[data-cursor], a, button, summary, label[for], [role='button']");
      const openTarget = element?.closest<HTMLElement>("[data-cursor='project'], [data-cursor='showreel']");
      root.classList.toggle("is-native", Boolean(nativeControl));
      root.classList.toggle("is-interactive", Boolean(interactive) && !nativeControl);
      root.classList.toggle("is-open", Boolean(openTarget) && !nativeControl);
    };

    const onMove = (event: PointerEvent) => {
      if (!event.isPrimary || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      place(ringElement, event.clientX, event.clientY);
      place(dotElement, event.clientX, event.clientY);
      setMode(event.target);
      root.classList.add("is-visible");
    };

    const onOver = (event: PointerEvent) => setMode(event.target);

    const hide = () => root.classList.remove("is-visible", "is-interactive", "is-open", "is-native", "is-pressed");
    const press = (event: PointerEvent) => {
      if (event.isPrimary && event.button === 0 && root.classList.contains("is-visible")) root.classList.add("is-pressed");
    };
    const release = () => root.classList.remove("is-pressed");
    const onVisibilityChange = () => { if (document.hidden) hide(); };

    document.documentElement.classList.add("cursor-ready");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("pointercancel", release, { passive: true });
    document.addEventListener("lostpointercapture", release, { passive: true });
    document.addEventListener("dragend", release, { passive: true });
    document.addEventListener("contextmenu", release);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", release);
      document.removeEventListener("lostpointercapture", release);
      document.removeEventListener("dragend", release);
      document.removeEventListener("contextmenu", release);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursor} aria-hidden="true">
      <span className="custom-cursor-ring" ref={ring}><ArrowUpRight className="custom-cursor-arrow" strokeWidth={3.4} /></span>
      <span className="custom-cursor-dot" ref={dot} />
    </div>
  );
}
