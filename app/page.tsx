import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Sparkles } from "lucide-react";
import { projects, services } from "@/lib/portfolio";
import { getSiteContent, listPortfolioProjects, listPortfolioServices } from "@/db/repository";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { ShowreelDialog } from "@/components/ShowreelDialog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [brand, liveProjects, liveServices] = await Promise.all([getSiteContent(), listPortfolioProjects(projects, { publishedOnly: true }), listPortfolioServices(services)]);
  const featured = liveProjects.filter((project) => project.featured).slice(0, 6);
  const showcaseCategories = Array.from(new Set(featured.map((project) => project.category)));
  const proofProject = liveProjects[8] ?? liveProjects.at(-1);
  return (
    <>
      <section className="home-hero section-shell">
        <div className="hero-meta"><p><span className="status-dot" />{brand.availability}</p><p>{brand.location}<br />{brand.timezone}</p></div>
        <div className="hero-title" aria-label={brand.headline}>
          <span className="hero-line"><span data-hero-line>{brand.heroLineOne}</span></span>
          <span className="hero-line hero-line-accent"><span data-hero-line>{brand.heroLineTwo}</span></span>
        </div>
        <div className="hero-bottom">
          <p>{brand.intro}</p>
          <div className="hero-actions"><Link className="button button-accent" href="/work">Explore the archive <ArrowRight aria-hidden="true" /></Link><Link className="text-link" href="/start-a-project">Start a project <ArrowUpRight aria-hidden="true" /></Link></div>
          <a className="scroll-note" href="#selected-work"><ArrowDown aria-hidden="true" /> Scroll to explore</a>
        </div>
        <div className="hero-frame" data-parallax aria-hidden="true"><span>OB/26</span><span>EDIT</span><i /><i /><i /></div>
      </section>

      <div className="discipline-rail" aria-label="Disciplines"><div><span>VIDEO EDITING</span><Asterisk /><span>2D MOTION</span><Asterisk /><span>GRAPHIC DESIGN</span><Asterisk /><span>VISUAL SYSTEMS</span><Asterisk /><span>VIDEO EDITING</span></div></div>

      <section id="selected-work" className="selected-work section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01</span>Selected work</p><h2>{brand.workHeading}</h2></div><div><p>{brand.workIntro}</p><Link className="text-link" href="/work">Enter the full archive <ArrowUpRight aria-hidden="true" /></Link></div></div>
        <div className="showcase-system">
          <div className="showcase-toolbar" data-reveal>
            <div className="showcase-count"><span>Live showcase</span><strong>{String(featured.length).padStart(2, "0")}</strong></div>
            <div className="showcase-categories" aria-label="Featured project categories">{showcaseCategories.map((category) => <span key={category}>{category}</span>)}</div>
            <p>Selected work<br />Open any frame to explore</p>
          </div>
          <ShowcaseGrid projects={featured} />
          <div className="showcase-footer"><span>Curated selection / {new Date().getFullYear()}</span><span>Hover, tap, or use the keyboard to open a showcase item</span></div>
        </div>
        <div className="archive-callout" data-reveal><p><span>{liveProjects.length}</span> curated showcase items</p><p>Filter by discipline, industry, and year. Explore single pieces, bundles, motion work, design systems, and deeper project stories.</p><Link className="button button-light" href="/work">Browse everything <ArrowRight aria-hidden="true" /></Link></div>
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

      <section className="why-section section-shell section-space">
        <div className="why-mark"><Sparkles aria-hidden="true" /><span>WHY ORKO</span></div>
        <div className="why-copy" data-reveal><p className="eyebrow">The useful difference</p><h2>Not more motion.<br /><em>Better reasons to move.</em></h2><p>Every creative choice has a job: make the story easier to follow, the brand easier to recognize, or the moment harder to forget.</p></div>
        <div className="why-grid">
          {[['01','Story before software','The edit begins with what the audience should understand and feel—not an effect list.'],['02','Systems, not one-offs','A strong idea is designed to survive vertical, square, widescreen, static, and motion.'],['03','Organized collaboration','Clear milestones, focused review rounds, tidy source files, and no mystery between brief and delivery.'],['04','Platform-aware finish','Caption safety, crop behavior, compression, pacing, and delivery specs are considered from the start.']].map(([number,title,copy]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="process-preview section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>04</span>Process</p><h2>Clear enough to trust.<br /><em>Flexible enough to create.</em></h2></div><Link className="text-link" href="/process">See the full process <ArrowUpRight aria-hidden="true" /></Link></div>
        <ol className="process-list">{[['Discover','The context, audience, constraints, and real objective.'],['Define','The story spine, visual route, scope, and production plan.'],['Create','The rough cut, style frames, and working motion language.'],['Review','Focused feedback against the agreed objective.'],['Refine','Detail, timing, sound, color, and format adaptation.'],['Deliver','Organized masters, versions, and source handoff when scoped.']].map(([title,copy], index) => <li key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><i /></li>)}</ol>
      </section>

      <section className="proof-section section-shell section-space">
        {proofProject && <div className="proof-art"><ProjectArtwork project={proofProject} compact /></div>}
        <div data-reveal><p className="eyebrow">Proof without theatre</p><h2>No invented metrics.<br />No borrowed praise.</h2><p>Verified results and testimonials will appear only when supplied and approved. Until then, the portfolio earns trust through process clarity, craft, and transparent project framing.</p><Link className="text-link" href="/about">Meet Orko <ArrowUpRight aria-hidden="true" /></Link></div>
      </section>
    </>
  );
}
