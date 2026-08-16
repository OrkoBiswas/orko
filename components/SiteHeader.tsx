"use client";
/* eslint-disable @next/next/no-img-element -- Owner-controlled logo URLs are validated before storage. */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

const navigation = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Journal", "/journal"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({ content: brand }: { content: SiteContent }) {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState<"closed" | "open" | "closing">("closed");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = menuState === "open";
  const menuVisible = menuState !== "closed";

  const clearCloseTimer = useCallback(() => {
    if (!closeTimer.current) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setMenuState("open");
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    if (menuState !== "open") return;
    clearCloseTimer();
    setMenuState("closing");
    closeTimer.current = setTimeout(() => {
      setMenuState("closed");
      closeTimer.current = null;
    }, 760);
  }, [clearCloseTimer, menuState]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuVisible);
    return () => document.body.classList.remove("menu-open");
  }, [menuVisible]);

  useEffect(() => {
    let previousY = Math.max(window.scrollY, 0);
    let frame = 0;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateHeader = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - previousY;
      const reduced = motionPreference.matches || document.documentElement.dataset.motion === "reduced";

      setScrolled(currentY > 18);

      if (reduced || menuVisible || engaged || currentY < 112) {
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
  }, [engaged, menuVisible]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeMenu, open]);

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
        <Link className="wordmark" href="/" aria-label={`${brand.name}, home`} onClick={closeMenu}>
          {brand.logoUrl ? <img className="wordmark-logo" src={brand.logoUrl} alt={brand.logoAlt || `${brand.name} logo`} /> : <span className="wordmark-mark">{brand.monogram}</span>}
        </Link>
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
        <button className="menu-button" type="button" onClick={open ? closeMenu : openMenu} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
          <span className="menu-button-label">{open ? "Close" : "Menu"}</span>
          <span className="menu-button-icon" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}${menuState === "closing" ? " is-closing" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href], index) => (
            <Link href={href} key={href} onClick={closeMenu} aria-current={isCurrent(href) ? "page" : undefined}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
          <Link className="mobile-menu-cta" href="/start-a-project" onClick={closeMenu}>
            <span><small>Have a project?</small><strong>Let&apos;s work</strong></span>
            <ArrowUpRight aria-hidden="true" />
            <i aria-hidden="true" />
          </Link>
        </nav>
        <p>{brand.location}</p>
      </div>
    </header>
  );
}
