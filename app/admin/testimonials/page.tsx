import { AdminShell } from "@/components/AdminShell";
import { AdminTestimonialsForm } from "@/components/AdminTestimonialsForm";
import { getSiteContent } from "@/db/repository";
import { requireOwner } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const user = await requireOwner("/admin/testimonials");
  const content = await getSiteContent();
  return <AdminShell user={user} eyebrow="Social proof" title="Testimonials"><div className="admin-summary-line"><p>Manage approved client feedback and the public auto-sliding testimonial section.</p><span>{content.testimonials.length} published</span></div><AdminTestimonialsForm initial={content} /></AdminShell>;
}
