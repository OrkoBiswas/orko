import { Quote } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function TestimonialsSection({ content, index = "07" }: { content: SiteContent; index?: string }) {
  return (
    <section className="testimonials-section section-shell section-space">
      <div className="section-heading light" data-reveal>
        <div><p className="eyebrow"><span>{index}</span>Testimonials</p><h2>{content.testimonialsHeading}</h2></div>
        <p>{content.testimonialsIntro}</p>
      </div>
      {content.testimonials.length > 0 ? <div className="testimonial-grid">
        {content.testimonials.map((testimonial, itemIndex) => <figure key={testimonial.id} data-reveal>
          <div className="testimonial-top"><Quote aria-hidden="true" /><span>{String(itemIndex + 1).padStart(2, "0")}</span></div>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption><strong>{testimonial.name}</strong>{[testimonial.role, testimonial.company].filter(Boolean).length > 0 && <span>{[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}</span>}</figcaption>
        </figure>)}
      </div> : <div className="testimonial-empty" data-reveal>
        <div><Quote aria-hidden="true" /><span>Approved feedback only</span></div>
        <h3>No made-up quotes.</h3>
        <p>Client feedback will appear here only after the person has approved the quote and credit. Until then, the work library shows what I can create.</p>
      </div>}
    </section>
  );
}
