import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function CtaBand({ title = <>Ready to start<br />your project?</>, copy = "Share your goal, deadline, budget, and available materials. I will reply with a clear next step." }: { title?: React.ReactNode; copy?: string }) {
  return (
    <section className="cta-band">
      <div className="cta-band-inner section-shell">
        <div><p className="eyebrow">Start a collaboration</p><h2>{title}</h2></div>
        <div className="cta-actions"><p>{copy}</p><Link className="button button-dark" href="/start-a-project">Build a project brief <ArrowRight aria-hidden="true" /></Link><Link className="text-link" href="/contact">Send a quick message <ArrowUpRight aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}
