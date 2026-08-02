"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Play, X } from "lucide-react";

export function ShowreelDialog({ triggerLabel = "Play showreel" }: { triggerLabel?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === element) element.close();
    };
    element.addEventListener("click", closeOnBackdrop);
    return () => element.removeEventListener("click", closeOnBackdrop);
  }, []);

  return (
    <>
      <button className="reel-trigger" type="button" onClick={() => dialog.current?.showModal()}><span><Play aria-hidden="true" fill="currentColor" /></span>{triggerLabel}</button>
      <dialog className="reel-dialog" ref={dialog} aria-labelledby="reel-title">
        <div className="reel-dialog-inner">
          <button className="dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="Close showreel"><X aria-hidden="true" /></button>
          <div className="reel-stage">
            <div className="reel-frames" aria-hidden="true"><span /><span /><span /><span /></div>
            <p>SHOWREEL / 01:12</p>
            <h2 id="reel-title">The reel is being fitted with final licensed footage.</h2>
            <p>No placeholder clip is pretending to be client work. Explore the case studies now, or return when the final captioned reel is published.</p>
            <Link className="button button-accent" href="/work" onClick={() => dialog.current?.close()}>Explore the work <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </dialog>
    </>
  );
}

