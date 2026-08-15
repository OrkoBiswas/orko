/* eslint-disable @next/next/no-img-element -- About photos use owner-managed, validated Cloudinary delivery URLs. */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getSiteContent } from "@/db/repository";
import { aboutPageContent } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Orko Biswas and learn about his visual design practice, career, work life, and approach to client projects.",
};
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  const frameLabels = ["Working process", "Studio moments", "Behind the work"];
  const storyFrames = frameLabels.map((fallbackLabel, index) => ({ media: content.aboutGallery[index] ?? null, fallbackLabel, index }));
  const expertise = content.expertiseAreas.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8);

  return <main className="about-page">
    <section className="about-intro section-shell">
      <div className="about-intro-rail">
        <p className="eyebrow"><span>03</span>About Orko</p>
        <p>{content.shortTitle}</p>
      </div>
      <div className="about-intro-grid">
        <div className="about-intro-copy" data-reveal>
          <h1>{aboutPageContent.headlineLead}<br /><em>{aboutPageContent.headlineAccent}</em></h1>
          <p>{content.biography}</p>
          <div className="about-intro-actions">
            <Link className="button button-dark" href="/work">See selected work <ArrowRight aria-hidden="true" /></Link>
            <Link className="text-link" href="/start-a-project">Start a project <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className={`about-portrait${content.profileImageUrl ? " has-image" : ""}`} data-reveal>
          {content.profileImageUrl
            ? <img src={content.profileImageUrl} alt={content.profileImageAlt || `Portrait of ${content.name}`} fetchPriority="high" />
            : <div className="about-portrait-fallback" aria-label={`Portrait placeholder for ${content.name}`}><span>{content.monogram}</span></div>}
          <figcaption><strong>{content.name}</strong><span>{content.location}</span></figcaption>
        </figure>
      </div>
      <dl className="about-facts" data-reveal>
        <div><dt>Based in</dt><dd>{content.location}</dd></div>
        <div><dt>Practice</dt><dd>Independent</dd></div>
        <div><dt>Working with</dt><dd>{content.serviceArea}</dd></div>
        <div><dt>Status</dt><dd>{content.availability}</dd></div>
      </dl>
    </section>

    <section className="about-story section-shell">
      <div className="about-story-rail" data-reveal><p className="eyebrow"><span>01</span>Work, life &amp; trust</p><p>Daily practice · Career · Client care</p></div>
      <div className="about-story-stage">
        <header className="about-story-title" data-reveal><h2><span>Work.</span><em>Life.</em><span>Trust.</span></h2><p>Three simple parts shape how I think, grow, and collaborate.</p></header>
        <ol className="about-story-timeline">
          <li data-reveal><span className="about-story-node">01</span><div><p>Work life</p><h3>{aboutPageContent.workLifeHeading}</h3></div><p>{content.aboutWorkLife}</p></li>
          <li data-reveal><span className="about-story-node">02</span><div><p>Career</p><h3>{aboutPageContent.careerHeading}</h3></div><p>{content.aboutCareer}</p></li>
          <li data-reveal><span className="about-story-node">03</span><div><p>Client care</p><h3>{aboutPageContent.clientCareHeading}</h3></div><p>{content.aboutClientCare}</p></li>
        </ol>
      </div>
      <div className="about-story-media" aria-label="Work life media highlights" data-reveal>
        {storyFrames.map(({ media, fallbackLabel, index }) => <figure className={`about-story-frame about-story-frame-${index}${media?.url ? " has-media" : " is-empty"}`} key={media?.id ?? fallbackLabel}>
          <div className="about-story-frame-media">
            {media?.url ? media.mediaType === "video"
              ? <video src={media.url} poster={media.posterUrl || undefined} controls muted loop playsInline preload="metadata" aria-label={media.alt} />
              : <img src={media.url} alt={media.alt} loading="lazy" />
              : <div className="about-story-frame-placeholder" aria-label={`${fallbackLabel} media has not been published yet`}><span>{content.monogram}</span><small>Media {String(index + 1).padStart(2, "0")}</small></div>}
          </div>
          <figcaption><span>{String(index + 1).padStart(2, "0")}</span><strong>{media?.caption || fallbackLabel}</strong></figcaption>
        </figure>)}
      </div>
    </section>

    <section className="about-career section-shell">
      <header className="about-section-head" data-reveal>
        <p className="eyebrow"><span>03</span>Career path</p>
        <h2>Experience,<br /><em>kept useful.</em></h2>
        <p>{content.experienceIntro}</p>
      </header>
      {content.experiences.length > 0 ? <ol className="about-career-list">
        {content.experiences.map((experience, index) => <li key={experience.id} data-reveal>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><p>{experience.organization}</p><h3>{experience.role}</h3><p>{experience.summary}</p></div>
          <dl><div><dt>Period</dt><dd>{experience.period}</dd></div><div><dt>Place</dt><dd>{experience.location}</dd></div></dl>
        </li>)}
      </ol> : <p className="about-career-empty">Career details will appear here when they are ready to publish.</p>}
    </section>

    <section className="about-focus section-shell">
      <div className="about-focus-title" data-reveal><p className="eyebrow"><span>04</span>Creative focus</p><h2>Flexible skills.<br /><em>One clear direction.</em></h2></div>
      <div className="about-focus-body" data-reveal>
        <p>I bring editing, motion, and design together when a project needs more than one format. The goal stays simple: make the idea easy to understand and good to experience.</p>
        {expertise.length > 0 && <ul aria-label="Creative expertise">{expertise.map((item) => <li key={item}>{item}</li>)}</ul>}
        <Link className="text-link" href="/services">Explore services <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>
  </main>;
}
