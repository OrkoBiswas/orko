"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = cursor.current;
    const ringElement = ring.current;
    const dotElement = dot.current;
    if (!root || !ringElement || !dotElement) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrame = 0;

    const place = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const animate = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      place(ringElement, ringX, ringY);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      place(dotElement, targetX, targetY);
      root.classList.add("is-visible");
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const nativeControl = target?.closest("input, textarea, select, [contenteditable='true']");
      const interactive = target?.closest<HTMLElement>("[data-cursor-label], a, button, summary");
      root.classList.toggle("is-native", Boolean(nativeControl));
      root.classList.toggle("is-active", Boolean(interactive) && !nativeControl);
      const fallbackLabel = interactive?.matches("button, summary") ? "Select" : interactive ? "Open" : "";
      setLabel(interactive?.dataset.cursorLabel ?? fallbackLabel);
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
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursor} aria-hidden="true">
      <span className="custom-cursor-ring" ref={ring}>{label && <b>{label}</b>}</span>
      <span className="custom-cursor-dot" ref={dot} />
    </div>
  );
}
