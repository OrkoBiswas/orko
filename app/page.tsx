import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { deriveShowcaseCategories, journalCategories, projectMatchesShowcaseCategory, projects, services } from "@/lib/portfolio";
import { getSiteContent, listCategoryThumbnails, listJournalPosts, listPortfolioProjects, listPortfolioServices } from "@/db/repository";
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
  const [brand, liveProjects, liveServices, categoryThumbnails, journal] = await Promise.all([getSiteContent(), listPortfolioProjects(projects, { publishedOnly: true }), listPortfolioServices(services), listCategoryThumbnails(), listJournalPosts({ publishedOnly: true, limit: 3 })]);
  const thumbnailsBySlug = new Map(categoryThumbnails.map((thumbnail) => [thumbnail.slug, thumbnail]));
  const showcaseCategories = deriveShowcaseCategories(liveProjects).flatMap((category) => {
    const matchingProjects = liveProjects.filter((project) => projectMatchesShowcaseCategory(project, category.value));
    const cover = matchingProjects.find((project) => project.featured) ?? matchingProjects[0];
    return cover ? [{ ...category, cover, thumbnail: thumbnailsBySlug.get(category.value), workCount: matchingProjects.length }] : [];
  });
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
          <a className="scroll-note" href="#about-experience"><ArrowDown aria-hidden="true" /> Scroll to explore</a>
          <p><span>Orko Biswas</span><span>Portfolio / 2026</span></p>
        </div>
      </section>

      <ExperienceSection content={brand} compact />

      <ProfileLinksBand content={brand} />

      {showcaseCategories.length > 0 && <section id="selected-work" className="selected-work section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01</span>Selected work</p><h2>{brand.workHeading}</h2></div><div><p>{brand.workIntro}</p><Link className="text-link" href="/work">Enter the full archive <ArrowUpRight aria-hidden="true" /></Link></div></div>
        <div className="showcase-library">
          <div className="showcase-library-top" data-reveal>
            <div className="showcase-library-title"><span>All categories</span><strong>Choose a creative direction.</strong></div>
            <p>Open any category to view its complete, image-led project stack.</p>
          </div>
          <ShowcaseGrid categories={showcaseCategories} />
          <div className="showcase-library-footer" data-reveal>
            <div><strong>{String(liveProjects.length).padStart(2, "0")}</strong><span>items in the full library</span></div>
            <p>Browse all video edits, motion work, posters, campaigns, social content, and creative bundles.</p>
            <Link className="button button-dark" href="/work">Browse everything <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>}

      <ShowreelLoop heading={brand.showreelHeading} intro={brand.showreelIntro} videoUrl={brand.showreelVideoUrl} posterUrl={brand.showreelPosterUrl} />

      <section className="services-section section-shell section-space">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>03</span>Capabilities</p><h2>{brand.capabilitiesHeading}</h2></div><p>{brand.capabilitiesIntro}</p></div>
        <div className="service-index">{liveServices.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><span>{service.number}</span><h3>{service.title}</h3><p>{service.short}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div>
        <Link className="button button-dark" href="/services">View all services <ArrowRight aria-hidden="true" /></Link>
      </section>

      {journal.length > 0 && <section className="journal-home-preview section-shell section-space">
        <div className="section-heading"><div><p className="eyebrow"><span>05</span>Studio journal</p><h2>Fresh ideas.<br /><em>Useful files.</em></h2></div><div><p>Creative news, practical editing notes, and development resources from the studio.</p><Link className="text-link" href="/journal">Open the journal <ArrowUpRight aria-hidden="true" /></Link></div></div>
        <div className="journal-home-grid">{journal.map((post, index) => <article className={`journal-home-card is-${post.category}`} key={post.id}><Link href={`/journal/${post.slug}`}><span className="journal-home-index">0{index + 1}</span><p>{journalCategories.find((category) => category.value === post.category)?.label} · {post.readingMinutes} min read</p><h3>{post.title}</h3><small>{post.excerpt}</small><span className="journal-home-arrow"><ArrowUpRight aria-hidden="true" /></span></Link></article>)}</div>
      </section>}

      <TestimonialsSection content={brand} index="06" />
    </>
  );
}
