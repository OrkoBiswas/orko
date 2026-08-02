import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { services } from "@/lib/portfolio";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = { title: "Services", description: "Video editing, 2D motion graphics, graphic design, promotional creative, social systems, and visual support by Orko Biswas." };

export default function ServicesPage() {
  return <>
    <PageHero index="02" eyebrow="Capabilities" title={<>The right craft<br />for the <em>idea.</em></>} intro="A connected creative practice spanning edit, motion, and design. Bring one defined deliverable or a messy launch that needs a visual system." />
    <section className="services-overview section-shell"><div className="service-card-list">{services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><span>{service.number}</span><h2>{service.title}</h2><p>{service.promise}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div></section>
    <CtaBand />
  </>;
}

