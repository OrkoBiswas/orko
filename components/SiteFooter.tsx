import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- Owner-controlled logo URLs are validated before storage. */
import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function SiteFooter({ content: brand }: { content: SiteContent }) {
  const profileLinks = brand.profileLinks.filter((link) => link.enabled && link.url).slice(0, 5);
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <p className="eyebrow">Available for the right collaboration</p>
        <h2>Make the next<br /><em>frame matter.</em></h2>
        <Link className="circle-link" href="/start-a-project" aria-label="Start a project">
          Start<br />a project <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className="footer-grid">
        <div>{brand.logoUrl ? <img className="footer-logo" src={brand.logoUrl} alt={brand.logoAlt || `${brand.name} logo`} /> : <span className="wordmark-mark">{brand.monogram}</span>}<p>{brand.shortTitle}<br />{brand.location}</p></div>
        <div><p className="footer-label">Explore</p><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/process">Process</Link></div>
        <div><p className="footer-label">Connect</p><Link href="/contact">Contact</Link>{profileLinks.map((link) => <a href={link.url} target="_blank" rel="me noreferrer" key={link.id}>{link.label}</a>)}<Link href="/admin">Owner</Link></div>
        <div><p className="footer-label">Status</p><p><span className="status-dot" />{brand.availability}</p><p>{brand.responseTime}</p></div>
      </div>
      <div className="footer-base">
        <p>© {new Date().getFullYear()} {brand.name}</p>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <a href="#top">Back to top <ArrowUp aria-hidden="true" size={15} /></a>
      </div>
    </footer>
  );
}
