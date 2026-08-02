import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Contact", description: "Send Orko Biswas a project inquiry for video editing, motion design, graphic design, or campaign work." };
export default function ContactPage() { return <>
  <PageHero index="06" eyebrow="Quick contact" title={<>Tell me what<br />needs to <em>move.</em></>} intro="A short route for an early question or defined request. For a complex project, use the guided brief so the first reply can be more specific." />
  <section className="contact-layout section-shell"><aside className="contact-aside"><p className="eyebrow">Direct inquiry</p><h2>A real reply,<br />not a sequence.</h2><p>Your information is stored only to review and respond to the project. No mailing list. No invented urgency.</p><dl><dt>Availability</dt><dd>{brand.availability}</dd><dt>Response time</dt><dd>{brand.responseTime}</dd><dt>Timezone</dt><dd>{brand.timezone}</dd><dt>Location</dt><dd>{brand.location}</dd></dl></aside><InquiryForm mode="contact" /></section>
  </>; }

