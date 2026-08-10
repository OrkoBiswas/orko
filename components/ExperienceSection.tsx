/* eslint-disable @next/next/no-img-element -- The owner portrait uses a validated Cloudinary delivery URL. */
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function ExperienceSection({ content, index = "04", showProfile = true, compact = false }: { content: SiteContent; index?: string; showProfile?: boolean; compact?: boolean }) {
  return (
    <section id="about-experience" className={`experience-section section-shell section-space${showProfile ? "" : " is-history-only"}${compact ? " is-compact" : ""}`}>
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow"><span>{index}</span>About &amp; experience</p><h2>{content.experienceHeading}</h2></div>
        <p>{content.experienceIntro}</p>
      </div>
      <div className="experience-layout">
        {showProfile && <aside className={`experience-profile${content.profileImageUrl ? " has-portrait" : ""}`} data-reveal>
          {content.profileImageUrl && <div className="experience-portrait"><img src={content.profileImageUrl} alt={content.profileImageAlt || `Portrait of ${content.name}`} /></div>}
          <div className="experience-profile-copy">
            {!content.profileImageUrl && <div className="experience-monogram" aria-hidden="true">{content.monogram}</div>}
            <p className="eyebrow">About {content.name.split(" ")[0]}</p>
            <h3>{content.name}</h3>
            <p>{content.biography}</p>
            <dl>
              <div><dt>Based in</dt><dd>{content.location}</dd></div>
              <div><dt>Working hours</dt><dd>{content.timezone}</dd></div>
              <div><dt>Availability</dt><dd>{content.availability}</dd></div>
            </dl>
            <Link className="text-link" href="/about">Read my full profile <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </aside>}
        <div className="experience-history">
          {content.experiences.length > 0 ? <ol>
            {content.experiences.map((experience, itemIndex) => <li key={experience.id} data-reveal>
              <div className="experience-index"><span>{String(itemIndex + 1).padStart(2, "0")}</span><strong>{experience.period}</strong></div>
              <div className="experience-role"><p>{experience.organization}</p><h3>{experience.role}</h3><p>{experience.summary}</p></div>
              <p className="experience-location"><MapPin aria-hidden="true" />{experience.location}</p>
            </li>)}
          </ol> : <div className="experience-empty" data-reveal><span>Work history</span><h3>Experience details are being prepared.</h3><p>Verified roles, workplaces, locations, and dates will appear here when they are ready to publish.</p></div>}
        </div>
      </div>
    </section>
  );
}
