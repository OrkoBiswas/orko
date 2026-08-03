import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Sparkles } from "lucide-react";
import { projects, services } from "@/lib/portfolio";
import { getSiteContent, listPortfolioProjects, listPortfolioServices } from "@/db/repository";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { ShowreelDialog } from "@/components/ShowreelDialog";
import { ExperienceSection } from "@/components/ExperienceSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { HeroMotionMedia } from "@/components/HeroMotionMedia";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [brand, liveProjects, liveServices] = await Promise.all([getSiteContent(), listPortfolioProjects(projects, { publishedOnly: true }), listPortfolioServices(services)]);
  const featured = liveProjects.filter((project) => project.featured).slice(0, 6);
  const showcaseDisciplines = [
    ["Video", featured.filter((project) => project.services.some((service) => ["Video Editing", "YouTube"].includes(service))).length],
    ["Motion", featured.filter((project) => project.services.some((service) => service.includes("Motion"))).length],
    ["Design", featured.filter((project) => project.services.some((service) => ["Graphic Design", "Brand Visuals", "Social Media"].includes(service))).length],
  ] as const;
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

      <div className="discipline-rail" aria-label="Disciplines"><div><span>VIDEO EDITING</span><Asterisk /><span>2D MOTION</span><Asterisk /><span>GRAPHIC DESIGN</span><Asterisk /><span>VISUAL SYSTEMS</span><Asterisk /><span>VIDEO EDITING</span></div></div>

      <section id="selected-work" className="selected-work section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01</span>Selected work</p><h2>{brand.workHeading}</h2></div><div><p>{brand.workIntro}</p><Link className="text-link" href="/work">Enter the full archive <ArrowUpRight aria-hidden="true" /></Link></div></div>
        <div className="showcase-library">
          <div className="showcase-library-top" data-reveal>
            <div className="showcase-library-title"><span>Featured library</span><strong>{String(featured.length).padStart(2, "0")} selected works</strong></div>
            <dl aria-label="Featured work disciplines">{showcaseDisciplines.map(([discipline, count]) => <div key={discipline}><dt>{discipline}</dt><dd>{String(count).padStart(2, "0")}</dd></div>)}</dl>
            <p>Each preview keeps the correct frame shape for video, vertical content, posters, squares, and banners.</p>
          </div>
          <ShowcaseGrid projects={featured} />
          <div className="showcase-library-footer" data-reveal>
            <div><strong>{String(liveProjects.length).padStart(2, "0")}</strong><span>items in the full library</span></div>
            <p>Browse all video edits, motion work, posters, campaigns, social content, and creative bundles.</p>
            <Link className="button button-accent" href="/work">Browse everything <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="showreel-section section-shell section-space">
        <div className="section-heading light" data-reveal><div><p className="eyebrow"><span>02</span>Showreel</p><h2>{brand.showreelHeading}</h2></div><p>{brand.showreelIntro}</p></div>
        <div className="showreel-poster" data-reveal><div className="poster-art" aria-hidden="true"><span>SHOW</span><span>REEL</span><i>00:00:00</i><b /></div><div className="showreel-controls"><ShowreelDialog /><div><span>01:12</span><span>Motion · Edit · Design</span></div></div></div>
      </section>

      <section className="services-section section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>03</span>Capabilities</p><h2>{brand.capabilitiesHeading}</h2></div><p>{brand.capabilitiesIntro}</p></div>
        <div className="service-index">{liveServices.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><span>{service.number}</span><h3>{service.title}</h3><p>{service.short}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div>
        <Link className="button button-dark" href="/services">View all services <ArrowRight aria-hidden="true" /></Link>
      </section>

      <ExperienceSection content={brand} />

      <section className="content-needs section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>05</span>What I can create</p><h2>Useful content for every screen.</h2></div><p>Choose one item or combine several into a complete content package.</p></div>
        <div className="content-needs-grid">
          {[
            ["01", "Brand and promo videos", "Clear edits for products, services, events, and campaigns."],
            ["02", "YouTube and interviews", "Well-paced long videos, interviews, chapters, and cutdowns."],
            ["03", "Reels and short videos", "Vertical edits with strong openings, captions, and clean timing."],
            ["04", "Motion graphics", "Animated titles, explainers, logos, text, and visual effects."],
            ["05", "Posters and social posts", "Strong layouts for campaigns, announcements, and daily content."],
            ["06", "Creative content bundles", "A connected set of video, motion, and design assets for one launch."],
          ].map(([number, title, copy]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="why-section section-shell section-space">
        <div className="why-mark"><Sparkles aria-hidden="true" /><span>WHY ORKO</span></div>
        <div className="why-copy" data-reveal><p className="eyebrow">Why work with me</p><h2>Clear ideas.<br /><em>Strong visual work.</em></h2><p>Every edit and design choice should make the message easier to understand and the work easier to remember.</p></div>
        <div className="why-grid">
          {[["01","Clear story","I first decide what the audience needs to understand, feel, or do."],["02","Consistent style","Colors, type, motion, and layouts stay connected across every format."],["03","Easy workflow","You get clear steps, focused feedback rounds, and regular updates."],["04","Ready for each platform","Every file is prepared for the correct screen, size, caption area, and format."],["05","Organized delivery","Final exports and source files are named clearly and easy to use."],["06","Flexible support","I can help with one task or support a larger campaign from start to finish."]].map(([number,title,copy]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="process-preview process-showcase section-shell" data-process-sequence>
        <div className="section-heading"><div><p className="eyebrow"><span>06</span>Process</p><h2>A clear path from idea to delivery.</h2></div><Link className="text-link" href="/process">See the full process <ArrowUpRight aria-hidden="true" /></Link></div>
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

      <TestimonialsSection content={brand} />
    </>
  );
}
