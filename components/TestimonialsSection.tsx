import { Quote } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export function TestimonialsSection({ content, index = "07" }: { content: SiteContent; index?: string }) {
  return (
    <section className="testimonials-section section-shell section-space">
      <div className="section-heading light" data-reveal>
        <div><p className="eyebrow"><span>{index}</span>Testimonials</p><h2>{content.testimonialsHeading}</h2></div>
        <p>{content.testimonialsIntro}</p>
      </div>
      {content.testimonials.length > 0 ? <TestimonialCarousel testimonials={content.testimonials} /> : <div className="testimonial-empty" data-reveal>
        <div><Quote aria-hidden="true" /><span>Client feedback desk</span></div>
        <div className="testimonial-empty-copy"><small>Approved words only</small><h3>Real feedback,<br />when ready.</h3><div className="testimonial-empty-rail" aria-hidden="true"><span>Approved quote</span><i /> <span>Client name</span><i /> <span>Role &amp; company</span><i /> <span>Approved quote</span></div></div>
        <p>This slider is ready for real client testimonials. Add approved quotes in the private dashboard and they will begin moving here automatically.</p>
      </div>}
    </section>
  );
}
