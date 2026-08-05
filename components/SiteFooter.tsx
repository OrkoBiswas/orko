import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- Owner-controlled logo URLs are validated before storage. */
import { ArrowRight, ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { footerContent } from "@/lib/portfolio";

export function SiteFooter({ content: brand }: { content: SiteContent }) {
  const managedProfiles = brand.profileLinks.filter((link) => link.enabled && link.url);
  const profileLinks = [
    ...managedProfiles,
    { id: "instagram-footer", platform: "instagram" as const, label: "Instagram", url: brand.instagram, enabled: true, featured: false },
    { id: "linkedin-footer", platform: "linkedin" as const, label: "LinkedIn", url: brand.linkedin, enabled: true, featured: false },
    { id: "behance-footer", platform: "behance" as const, label: "Behance", url: brand.behance, enabled: true, featured: false },
  ].filter((link, index, links) => link.url && links.findIndex((item) => item.url === link.url) === index).slice(0, 5);

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">
      <span className="footer-atmosphere" aria-hidden="true" />

      <div className="footer-cta">
        <div className="footer-cta-copy">
          <p className="footer-availability"><span aria-hidden="true" />{footerContent.availabilityLead}</p>
          <h2 id="footer-heading"><span>{footerContent.headlineLead}</span><em>{footerContent.headlineAccent}</em></h2>
        </div>
        <div className="footer-cta-side">
          <p>{footerContent.support}</p>
          <Link className="footer-project-link" href="/start-a-project">
            <span>Start a project</span>
            <i aria-hidden="true"><ArrowUpRight /></i>
          </Link>
        </div>
      </div>

      <div className="footer-contact-strip" aria-label="Contact details">
        <div className="footer-contact-email">
          <span>Email</span>
          <a href={`mailto:${brand.email}`}>{brand.email}<Mail aria-hidden="true" /></a>
        </div>
        <div><span>Based in</span><strong>{brand.location}</strong></div>
        <div><span>Reply time</span><strong>{brand.responseTime}</strong></div>
      </div>

      <div className="footer-directory">
        <div className="footer-identity">
          <Link className="footer-brand" href="/" aria-label={`${brand.name} home`}>
            {brand.logoUrl
              ? <img className="footer-logo" style={{ width: `${brand.logoWidth}px` }} src={brand.logoUrl} alt={brand.logoAlt || `${brand.name} logo`} />
              : <span className="wordmark-mark">{brand.monogram}</span>}
            <span className="footer-brand-copy"><strong>{brand.name}</strong><small>{brand.shortTitle}</small></span>
          </Link>
          <p>{footerContent.identityNote}</p>
          <span className="footer-live-status"><i aria-hidden="true" />{brand.availability}</span>
        </div>

        <nav className="footer-nav-grid" aria-label="Footer navigation">
          <div className="footer-nav-group">
            <p className="footer-label">Explore</p>
            <Link href="/work"><span>Selected work</span><ArrowRight aria-hidden="true" /></Link>
            <Link href="/services"><span>Services</span><ArrowRight aria-hidden="true" /></Link>
            <Link href="/about"><span>About</span><ArrowRight aria-hidden="true" /></Link>
            <Link href="/process"><span>Process</span><ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="footer-nav-group">
            <p className="footer-label">Work with me</p>
            <Link href="/start-a-project"><span>Start a project</span><ArrowRight aria-hidden="true" /></Link>
            <Link href="/contact"><span>Contact</span><ArrowRight aria-hidden="true" /></Link>
            <Link href="/showreel"><span>Showreel</span><ArrowRight aria-hidden="true" /></Link>
            <Link href="/resume"><span>Resume</span><ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="footer-nav-group footer-social-links">
            <p className="footer-label">Elsewhere</p>
            {profileLinks.length ? profileLinks.map((link) => (
              <a href={link.url} target="_blank" rel="me noreferrer" key={link.id}><span>{link.label}</span><ArrowUpRight aria-hidden="true" /></a>
            )) : <a href={`mailto:${brand.email}`}><span>Email Orko</span><ArrowUpRight aria-hidden="true" /></a>}
          </div>
        </nav>
      </div>

      <div className="footer-base">
        <p><span aria-hidden="true">&copy;</span> {new Date().getFullYear()} {brand.name}. Built for clear creative work.</p>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <a className="footer-back-top" href="#top">Back to top <span aria-hidden="true"><ArrowUp /></span></a>
      </div>
    </footer>
  );
}
