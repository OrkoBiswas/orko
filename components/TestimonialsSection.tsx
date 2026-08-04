import type { SiteContent } from "@/lib/site-content";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export function TestimonialsSection({ content, index = "06" }: { content: SiteContent; index?: string }) {
  if (!content.testimonials.length) return null;

  return (
    <section className="testimonials-section section-shell section-space">
      <div className="section-heading light" data-reveal>
        <div><p className="eyebrow"><span>{index}</span>Testimonials</p><h2>{content.testimonialsHeading}</h2></div>
        <p>{content.testimonialsIntro}</p>
      </div>
      <TestimonialCarousel testimonials={content.testimonials} />
    </section>
  );
}
