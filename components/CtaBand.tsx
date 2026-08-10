import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function CtaBand({ title = <>Let&apos;s create work<br />people remember.</>, copy = "Share your idea, goal, and deadline. I will reply with a clear direction and the best next step." }: { title?: React.ReactNode; copy?: string }) {
  return (
    <section className="cta-band" aria-labelledby="collaboration-heading">
      <div className="section-shell">
        <div className="cta-band-panel">
          <div className="cta-band-top"><p className="eyebrow">Start a collaboration</p><span>Visual design · Motion · Digital</span></div>
          <div className="cta-band-inner">
            <h2 id="collaboration-heading">{title}</h2>
            <div className="cta-actions"><p>{copy}</p><div className="cta-links"><Link className="button button-accent" href="/start-a-project">Start your project <ArrowRight aria-hidden="true" /></Link><Link className="cta-message-link" href="/contact">Send a quick message <ArrowUpRight aria-hidden="true" /></Link></div></div>
          </div>
          <ol className="cta-band-steps" aria-label="How to start"><li><span>01</span>Share the goal</li><li><span>02</span>Get a clear direction</li><li><span>03</span>Start with confidence</li></ol>
        </div>
      </div>
    </section>
  );
}
