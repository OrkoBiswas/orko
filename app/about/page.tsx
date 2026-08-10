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
  const gallery = content.aboutGallery.filter((item) => item.url);
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
      <header className="about-section-head about-story-head" data-reveal>
        <p className="eyebrow"><span>01</span>Work, life &amp; trust</p>
        <div className="about-story-heading"><h2>How I work,<br /><em>and why it matters.</em></h2><p>Three simple ideas guide my daily practice, career growth, and every client collaboration.</p></div>
      </header>
      <div className="about-story-list">
        <article data-word="Curiosity" data-reveal><div className="about-story-meta"><span>01</span><p>Work life</p></div><h3>{aboutPageContent.workLifeHeading}</h3><p>{content.aboutWorkLife}</p></article>
        <article data-word="Growth" data-reveal><div className="about-story-meta"><span>02</span><p>Career</p></div><h3>{aboutPageContent.careerHeading}</h3><p>{content.aboutCareer}</p></article>
        <article data-word="Trust" data-reveal><div className="about-story-meta"><span>03</span><p>Client care</p></div><h3>{aboutPageContent.clientCareHeading}</h3><p>{content.aboutClientCare}</p></article>
      </div>
    </section>

    {gallery.length > 0 && <section className="about-photo-journal">
      <div className="about-photo-head section-shell" data-reveal>
        <p className="eyebrow"><span>02</span>Photo journal</p>
        <div><h2>A little life<br /><em>behind the work.</em></h2><p>Real moments from the studio, daily practice, and the journey around each project.</p></div>
      </div>
      <div className="about-photo-grid section-shell">
        {gallery.map((photo, index) => <figure key={photo.id} className={`about-photo about-photo-${index % 4}`} data-reveal>
          <img src={photo.url} alt={photo.alt} loading="lazy" />
          {photo.caption && <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{photo.caption}</figcaption>}
        </figure>)}
      </div>
    </section>}

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
