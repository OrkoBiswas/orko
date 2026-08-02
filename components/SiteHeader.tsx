"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label={`${brand.name}, home`} onClick={() => setOpen(false)}>
        <span className="wordmark-mark">{brand.monogram}</span>
        <span>{brand.name}</span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <Link className="header-cta" href="/start-a-project">
        Let&apos;s work <ArrowUpRight aria-hidden="true" size={17} />
      </Link>
      <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href], index) => (
            <Link href={href} key={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
          <Link className="mobile-menu-cta" href="/start-a-project" onClick={() => setOpen(false)}>Start a project <ArrowUpRight aria-hidden="true" /></Link>
        </nav>
        <p>{brand.location}<br />{brand.availability}</p>
      </div>
    </header>
  );
}
