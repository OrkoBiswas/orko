import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata: Metadata = { title: "Start a Project", description: "Build a detailed creative project brief for Orko Biswas." };
export default function StartProjectPage() { return <>
  <PageHero index="07" eyebrow="Project brief" title={<>Share the details.<br /><em>Start clearly.</em></>} intro="Nine simple steps collect the information I need to understand your project and give you a useful reply." aside={<span className="eyebrow">About 4 minutes</span>} />
  <section className="brief-page"><div className="brief-shell"><div className="brief-brand"><div><span className="wordmark-mark">OB</span><strong>Project brief builder</strong></div><span>Securely stored · Reference on success</span></div><InquiryForm mode="brief" /></div></section>
  </>; }
