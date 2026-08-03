import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function ProfileLinksBand({ content }: { content: SiteContent }) {
  const links = content.profileLinks.filter((link) => link.enabled && link.url);
  if (!links.length) return null;
  return <section className="profile-links-band section-shell" aria-labelledby="profile-links-title" data-reveal>
    <div><p className="eyebrow">Find me online</p><h2 id="profile-links-title">{content.profileLinksHeading}</h2></div>
    <div className="profile-links-list">{links.map((link) => <a className={link.featured ? "is-featured" : ""} href={link.url} target="_blank" rel="me noreferrer" key={link.id}><span>{link.platform}</span><strong>{link.label}</strong><ArrowUpRight aria-hidden="true" /></a>)}</div>
  </section>;
}
