"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    if (!window.matchMedia("(pointer: fine)").matches || reduce) return;

    const root = cursor.current;
    const ringElement = ring.current;
    const dotElement = dot.current;
    if (!root || !ringElement || !dotElement) return;

    const place = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      place(ringElement, event.clientX, event.clientY);
      place(dotElement, event.clientX, event.clientY);
      root.classList.add("is-visible");
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const nativeControl = target?.closest("input, textarea, select, video[controls], iframe, [contenteditable='true']");
      const interactive = target?.closest<HTMLElement>("[data-cursor], a, button, summary, [role='button']");
      const openTarget = target?.closest<HTMLElement>("[data-cursor='project'], [data-cursor='showreel']");
      root.classList.toggle("is-native", Boolean(nativeControl));
      root.classList.toggle("is-interactive", Boolean(interactive) && !nativeControl);
      root.classList.toggle("is-open", Boolean(openTarget) && !nativeControl);
    };

    const hide = () => root.classList.remove("is-visible");
    const press = () => root.classList.add("is-pressed");
    const release = () => root.classList.remove("is-pressed");

    document.documentElement.classList.add("cursor-ready");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
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
