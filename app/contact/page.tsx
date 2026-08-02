import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";
import { getSiteContent } from "@/db/repository";

export const metadata: Metadata = { title: "Contact", description: "Send Orko Biswas a project inquiry for video editing, motion design, graphic design, or campaign work." };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();
  return <>
    <PageHero index="06" eyebrow="Contact" title={<>Tell me about<br />your <em>project.</em></>} intro="Send a quick question or share a clear request. For a larger project, use the guided brief so I can give you a useful first reply." />
    <section className="contact-layout section-shell"><aside className="contact-aside"><p className="eyebrow">Direct contact</p><h2>A clear and personal reply.</h2><p>Your details are used only to review and reply to your project. You will not be added to a mailing list.</p><dl><dt>Availability</dt><dd>{content.availability}</dd><dt>Response time</dt><dd>{content.responseTime}</dd><dt>Timezone</dt><dd>{content.timezone}</dd><dt>Location</dt><dd>{content.location}</dd><dt>Email</dt><dd><a href={`mailto:${content.email}`}>{content.email}</a></dd></dl></aside><InquiryForm mode="contact" /></section>
  </>;
}
