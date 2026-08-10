import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/portfolio";
import { listPortfolioServices } from "@/db/repository";

export const metadata: Metadata = { title: "Services", description: "Video editing, 2D motion graphics, graphic design, promotional creative, social systems, and visual support by Orko Biswas." };

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const liveServices = await listPortfolioServices(services);
  return <div className="simple-services-page">
    <header className="simple-services-hero section-shell">
      <div className="simple-services-topline">
        <p className="eyebrow"><span>02</span>Services</p>
        <p>{String(liveServices.length).padStart(2, "0")} ways I can help</p>
      </div>

      <div className="simple-services-intro">
        <h1>Clear creative<br /><em>support.</em></h1>
        <div className="simple-services-summary">
          <p>I help brands, teams, and creators with video, motion, and design. Choose a service below, or tell me your goal and I will help you choose.</p>
          <div className="simple-services-actions">
            <a href="#service-list">See all services <ArrowDown aria-hidden="true" /></a>
            <Link href="/start-a-project">Tell me what you need <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>

      <ul className="simple-services-audience" aria-label="Clients I work with">
        <li>Brands</li>
        <li>Creative teams</li>
        <li>Creators</li>
        <li>Growing businesses</li>
      </ul>
    </header>

    <section className="simple-services-list section-shell" id="service-list" aria-labelledby="service-list-heading">
      <div className="simple-services-list-head">
        <div>
          <p className="eyebrow">Service areas</p>
          <h2 id="service-list-heading">Choose what you need.</h2>
        </div>
        <p>Open a service to see what is included. If you need more than one, I can build a simple plan for the full project.</p>
      </div>

      <div className="simple-service-rows">
        {liveServices.map((service) => <article key={service.slug}>
          <Link href={`/services/${service.slug}`}>
            <span className="simple-service-number" aria-hidden="true">{service.number}</span>
            <div className="simple-service-copy">
              <h3>{service.title}</h3>
              <p>{service.short}</p>
            </div>
            <div className="simple-service-fit">
              <span>Good for</span>
              <p>{service.idealFor.slice(0, 2).join(" / ")}</p>
            </div>
            <div className="simple-service-time">
              <span>Typical timing</span>
              <p>{service.timeline}</p>
            </div>
            <span className="simple-service-open">View details <ArrowUpRight aria-hidden="true" /></span>
          </Link>
        </article>)}
      </div>
    </section>

    <aside className="simple-services-help section-shell" aria-labelledby="service-help-heading">
      <div>
        <p className="eyebrow">Not sure where to start?</p>
        <h2 id="service-help-heading">Start with your goal.</h2>
      </div>
      <p>Tell me what you want to make, who should see it, and when you need it. I will suggest a clear next step.</p>
      <Link href="/contact">Ask a simple question <ArrowUpRight aria-hidden="true" /></Link>
    </aside>
  </div>;
}
