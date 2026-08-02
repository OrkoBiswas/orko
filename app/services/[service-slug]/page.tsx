import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getProject, getService, services } from "@/lib/portfolio";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaBand } from "@/components/CtaBand";

export function generateStaticParams() { return services.map((service) => ({ "service-slug": service.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ "service-slug": string }> }): Promise<Metadata> { const { "service-slug": slug } = await params; const service = getService(slug); return service ? { title: service.title, description: service.promise } : { title: "Service not found" }; }

export default async function ServicePage({ params }: { params: Promise<{ "service-slug": string }> }) {
  const { "service-slug": slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = service.related.map(getProject).filter((item) => item !== undefined);
  return <>
    <PageHero index={service.number} eyebrow="Service" title={<>{service.title.split(" ").slice(0,-1).join(" ")}<br /><em>{service.title.split(" ").at(-1)}</em></>} intro={service.promise} />
    <section className="service-detail-intro section-shell"><h2>{service.short}</h2><div className="service-facts"><div><span>Typical timing</span><p>{service.timeline}</p></div><div><span>Pricing mode</span><p>{service.pricing}</p></div><div><span>Starting point</span><p>Focused discovery and a clear scope</p></div></div></section>
    <section className="service-lists"><div className="service-lists-inner section-shell"><div><p className="eyebrow">Typical deliverables</p><ul className="numbered-list">{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="eyebrow">A strong fit for</p><ul className="numbered-list">{service.idealFor.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
    <section className="editorial-section section-shell"><div className="section-heading"><div><p className="eyebrow">Related work</p><h2>See the craft<br /><em>in context.</em></h2></div><Link className="text-link" href="/work">Full archive <ArrowUpRight aria-hidden="true" /></Link></div><div className="featured-grid">{related.map((project) => <ProjectCard project={project} key={project.id} />)}</div></section>
    <section className="editorial-section section-shell"><div className="editorial-grid"><p className="eyebrow">Common question</p><div className="faq-list">{service.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section>
    <CtaBand title={<>Make {service.title.toLowerCase()}<br />work harder.</>} />
  </>;
}
