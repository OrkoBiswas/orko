import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { services } from "@/lib/portfolio";
import { CtaBand } from "@/components/CtaBand";
import { listPortfolioServices } from "@/db/repository";

export const metadata: Metadata = { title: "Services", description: "Video editing, 2D motion graphics, graphic design, promotional creative, social systems, and visual support by Orko Biswas." };

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const liveServices = await listPortfolioServices(services);
  return <>
    <PageHero index="02" eyebrow="Services" title={<>Video, motion,<br />and <em>design.</em></>} intro="Choose one clear service or combine several for a complete project, campaign, or content package." />
    <section className="services-overview section-shell"><div className="service-card-list">{liveServices.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><span>{service.number}</span><h2>{service.title}</h2><p>{service.promise}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div></section>
    <CtaBand />
  </>;
}
