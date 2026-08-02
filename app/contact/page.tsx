import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";
import { getSiteContent } from "@/db/repository";

export const metadata: Metadata = { title: "Contact", description: "Send Orko Biswas a project inquiry for video editing, motion design, graphic design, or campaign work." };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();
  return <>
    <PageHero index="06" eyebrow="Quick contact" title={<>Tell me what<br />needs to <em>move.</em></>} intro="A short route for an early question or defined request. For a complex project, use the guided brief so the first reply can be more specific." />
    <section className="contact-layout section-shell"><aside className="contact-aside"><p className="eyebrow">Direct inquiry</p><h2>A real reply,<br />not a sequence.</h2><p>Your information is stored only to review and respond to the project. No mailing list. No invented urgency.</p><dl><dt>Availability</dt><dd>{content.availability}</dd><dt>Response time</dt><dd>{content.responseTime}</dd><dt>Timezone</dt><dd>{content.timezone}</dd><dt>Location</dt><dd>{content.location}</dd><dt>Email</dt><dd><a href={`mailto:${content.email}`}>{content.email}</a></dd></dl></aside><InquiryForm mode="contact" /></section>
  </>;
}
