"use client";
/* eslint-disable @next/next/no-img-element -- Owner-controlled logo URLs are validated before storage. */

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

const navigation = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Process", "/process"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({ content: brand }: { content: SiteContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    let previousY = Math.max(window.scrollY, 0);
    let frame = 0;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateHeader = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - previousY;
      const reduced = motionPreference.matches || document.documentElement.dataset.motion === "reduced";

      setScrolled(currentY > 18);

      if (reduced || open || engaged || currentY < 112) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      previousY = currentY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    const onMotionChange = () => {
      if (motionPreference.matches) setHidden(false);
    };

    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    motionPreference.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      motionPreference.removeEventListener("change", onMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [engaged, open]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`site-header${hidden ? " is-hidden" : ""}${scrolled ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}
      onFocusCapture={(event) => {
        setEngaged(event.target instanceof HTMLElement && event.target.matches(":focus-visible"));
        setHidden(false);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false);
      }}
    >
      <div className="header-shell">
        <Link className="wordmark" href="/" aria-label={`${brand.name}, home`} onClick={() => setOpen(false)}>
          {brand.logoUrl ? <img className="wordmark-logo" src={brand.logoUrl} alt={brand.logoAlt || `${brand.name} logo`} /> : <span className="wordmark-mark">{brand.monogram}</span>}
        </Link>
        <div className="header-context" aria-label={`${brand.availability}. Time zone ${brand.timezone}`}>
          <span><i aria-hidden="true" />{brand.availability}</span>
          <small>{brand.timezone}</small>
        </div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href], index) => (
            <Link href={href} key={href} aria-current={isCurrent(href) ? "page" : undefined}>
              <span>0{index + 1}</span><strong>{label}</strong>
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/start-a-project">
          <span className="header-cta-copy"><small>Have a project?</small><strong>Let&apos;s work</strong></span>
          <span className="header-cta-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
          <span className="header-saber-track" aria-hidden="true"><i /></span>
        </Link>
        <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
          <span>{open ? "Close" : "Menu"}</span>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href], index) => (
            <Link href={href} key={href} onClick={() => setOpen(false)} aria-current={isCurrent(href) ? "page" : undefined}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
          <Link className="mobile-menu-cta" href="/start-a-project" onClick={() => setOpen(false)}>
            <span><small>Have a project?</small><strong>Let&apos;s work</strong></span>
            <ArrowUpRight aria-hidden="true" />
            <i aria-hidden="true" />
          </Link>
        </nav>
        <p>{brand.location}<br />{brand.availability}</p>
      </div>
    </header>
  );
}
