import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { projectMatchesDiscipline, projects, services, workDisciplines } from "@/lib/portfolio";
import { getSiteContent, listPortfolioProjects, listPortfolioServices } from "@/db/repository";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { ShowreelLoop } from "@/components/ShowreelLoop";
import { ExperienceSection } from "@/components/ExperienceSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { HeroMotionMedia } from "@/components/HeroMotionMedia";
import { ProfileLinksBand } from "@/components/ProfileLinksBand";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const canonical = (content.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://orkobiswas.com").replace(/\/$/, "");
  return { alternates: { canonical } };
}

export default async function Home() {
  const [brand, liveProjects, liveServices] = await Promise.all([getSiteContent(), listPortfolioProjects(projects, { publishedOnly: true }), listPortfolioServices(services)]);
  const featured = liveProjects.filter((project) => project.featured).slice(0, 6);
  const showcaseDisciplines = workDisciplines.map((discipline) => ({ ...discipline, count: liveProjects.filter((project) => projectMatchesDiscipline(project, discipline.value)).length }));
  const processStages = [
    { title: "Discover", copy: "We discuss your goal, audience, content, deadline, and budget.", details: ["Goal", "Audience", "Scope"] },
    { title: "Plan", copy: "I prepare the story, visual direction, deliverables, and schedule.", details: ["Story", "Formats", "Schedule"] },
    { title: "Create", copy: "I build the first edit, design, or motion direction.", details: ["Edit", "Design", "Motion"] },
    { title: "Review", copy: "You share clear feedback and we agree on the next changes.", details: ["Notes", "Priorities", "Changes"] },
    { title: "Refine", copy: "I improve timing, sound, color, text, and final details.", details: ["Timing", "Sound", "Color"] },
    { title: "Deliver", copy: "You receive clean files in the correct formats and sizes.", details: ["Exports", "Sizes", "Source files"] },
  ] as const;
  return (
    <>
      <section className="home-hero section-shell">
        <div className="hero-meta"><p><span className="status-dot" />{brand.availability}</p><p>{brand.location}<br />{brand.timezone}</p></div>
        <div className="hero-light-rays" aria-hidden="true"><span /></div>
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-name"><span>Creative portfolio</span><strong>{brand.name}</strong></p>
            <h1 className="hero-title" aria-label={brand.headline}>
              <span className="hero-line"><span data-hero-line>{brand.heroLineOne}</span></span>
              <span className="hero-line hero-line-accent"><span data-hero-line><em>{brand.heroLineTwo}</em></span></span>
            </h1>
            <div className="hero-support">
              <p className="hero-intro">{brand.intro}</p>
              <div className="hero-actions"><Link className="button button-accent" href="/work">Explore the archive <ArrowRight aria-hidden="true" /></Link><Link className="text-link" href="/start-a-project">Start a project <ArrowUpRight aria-hidden="true" /></Link></div>
            </div>
          </div>
          <HeroMotionMedia />
        </div>
        <div className="hero-foot">
          <a className="scroll-note" href="#selected-work"><ArrowDown aria-hidden="true" /> Scroll to explore</a>
          <p><span>Orko Biswas</span><span>Portfolio / 2026</span></p>
        </div>
      </section>

      <ProfileLinksBand content={brand} />

      <section id="selected-work" className="selected-work section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01</span>Selected work</p><h2>{brand.workHeading}</h2></div><div><p>{brand.workIntro}</p><Link className="text-link" href="/work">Enter the full archive <ArrowUpRight aria-hidden="true" /></Link></div></div>
        <div className="showcase-library">
          <div className="showcase-library-top" data-reveal>
            <div className="showcase-library-title"><span>Project runway</span><strong>{String(featured.length).padStart(2, "0")} featured chapters</strong></div>
            <dl aria-label="Browse category showreels">{showcaseDisciplines.map((discipline) => <div key={discipline.value}><dt><Link href={`/work?discipline=${discipline.value}`}>{discipline.label} <ArrowUpRight aria-hidden="true" /></Link></dt><dd>{String(discipline.count).padStart(2, "0")}</dd></div>)}</dl>
            <p>Move through each project as a full visual chapter. Every image and video keeps its correct frame.</p>
          </div>
          <ShowcaseGrid projects={featured} />
          <div className="showcase-library-footer" data-reveal>
            <div><strong>{String(liveProjects.length).padStart(2, "0")}</strong><span>items in the full library</span></div>
            <p>Browse all video edits, motion work, posters, campaigns, social content, and creative bundles.</p>
            <Link className="button button-dark" href="/work">Browse everything <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <ShowreelLoop heading={brand.showreelHeading} intro={brand.showreelIntro} videoUrl={brand.showreelVideoUrl} posterUrl={brand.showreelPosterUrl} />

      <section className="services-section section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>03</span>Capabilities</p><h2>{brand.capabilitiesHeading}</h2></div><p>{brand.capabilitiesIntro}</p></div>
        <div className="service-index">{liveServices.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><span>{service.number}</span><h3>{service.title}</h3><p>{service.short}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div>
        <Link className="button button-dark" href="/services">View all services <ArrowRight aria-hidden="true" /></Link>
      </section>

      <ExperienceSection content={brand} />

      <section className="process-preview process-showcase section-shell" data-process-sequence>
        <div className="section-heading"><div><p className="eyebrow"><span>05</span>Process</p><h2>A clear path from <em>idea</em><br />to delivery.</h2></div><Link className="text-link" href="/process">See the full process <ArrowUpRight aria-hidden="true" /></Link></div>
        <div className="process-stage" data-process-stage>
          <div className="process-track-head"><span>Project timeline · 01—06</span><span>From the first brief to organized final files</span></div>
          <div className="process-timeline" tabIndex={0} role="region" aria-label="Six-stage project timeline">
            <div className="process-timeline-canvas">
              <div className="process-line" aria-hidden="true"><span data-process-progress /></div>
              <ol className="process-milestones">{processStages.map((stage, index) => <li key={stage.title} data-process-step><span className="process-node" data-process-node aria-hidden="true">0{index + 1}</span><article className="process-detail" data-process-entry><small>Stage 0{index + 1}</small><h3>{stage.title}</h3><p>{stage.copy}</p><ul className="process-focus" data-process-detail aria-label={`${stage.title} focus areas`}>{stage.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article></li>)}</ol>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection content={brand} index="06" />
    </>
  );
}
