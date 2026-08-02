import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata: Metadata = { title: "Start a Project", description: "Build a detailed creative project brief for Orko Biswas." };
export default function StartProjectPage() { return <>
  <PageHero index="07" eyebrow="Guided project brief" title={<>A better brief.<br /><em>A sharper start.</em></>} intro="Nine focused steps turn the messy context into a useful creative starting point. Your answers remain visible until the inquiry is stored successfully." aside={<span className="eyebrow">About 4 minutes</span>} />
  <section className="brief-page"><div className="brief-shell"><div className="brief-brand"><div><span className="wordmark-mark">OB</span><strong>Project brief builder</strong></div><span>Securely stored · Reference on success</span></div><InquiryForm mode="brief" /></div></section>
  </>; }

