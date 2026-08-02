import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";
import { projects, services } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectArtwork } from "@/components/ProjectArtwork";
import { ShowreelDialog } from "@/components/ShowreelDialog";

export default function Home() {
  const featured = projects.filter((project) => project.featured).slice(0, 6);
  return (
    <>
      <section className="home-hero section-shell">
        <div className="hero-meta"><p><span className="status-dot" />{brand.availability}</p><p>{brand.location}<br />{brand.timezone}</p></div>
        <div className="hero-title" aria-label={brand.headline}>
          <span className="hero-line"><span data-hero-line>Visual stories,</span></span>
          <span className="hero-line hero-line-accent"><span data-hero-line>built to <em>move.</em></span></span>
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
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01</span>Selected work</p><h2>Work worth<br /><em>stalking.</em></h2></div><div><p>A growing library of edits, motion systems, campaigns, and visual experiments—built to be explored, not skimmed.</p><Link className="text-link" href="/work">Enter the full archive <ArrowUpRight aria-hidden="true" /></Link></div></div>
        <div className="featured-grid">{featured.map((project, index) => <ProjectCard project={project} key={project.id} priority={index < 2} />)}</div>
        <div className="archive-callout" data-reveal><p><span>{projects.length}</span> curated case studies</p><p>Filter by discipline, industry, and year. Every project opens into the decisions behind the final frame.</p><Link className="button button-light" href="/work">Browse everything <ArrowRight aria-hidden="true" /></Link></div>
      </section>

      <section className="showreel-section section-shell section-space">
        <div className="section-heading light" data-reveal><div><p className="eyebrow"><span>02</span>Showreel</p><h2>Seventy-two seconds<br />of <em>controlled energy.</em></h2></div><p>The final reel will use licensed work only. Until then, the project library carries every frame honestly.</p></div>
        <div className="showreel-poster" data-reveal><div className="poster-art" aria-hidden="true"><span>SHOW</span><span>REEL</span><i>00:00:00</i><b /></div><div className="showreel-controls"><ShowreelDialog /><div><span>01:12</span><span>Motion · Edit · Design</span></div></div></div>
      </section>

      <section className="services-section section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>03</span>Capabilities</p><h2>One visual partner.<br /><em>More momentum.</em></h2></div><p>From the first story beat to the final export matrix, the work stays connected by one clear idea.</p></div>
        <div className="service-index">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><span>{service.number}</span><h3>{service.title}</h3><p>{service.short}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div>
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
        <div className="proof-art"><ProjectArtwork project={projects[8]} compact /></div>
        <div data-reveal><p className="eyebrow">Proof without theatre</p><h2>No invented metrics.<br />No borrowed praise.</h2><p>Verified results and testimonials will appear only when supplied and approved. Until then, the portfolio earns trust through process clarity, craft, and transparent project framing.</p><Link className="text-link" href="/about">Meet Orko <ArrowUpRight aria-hidden="true" /></Link></div>
      </section>
    </>
  );
}
