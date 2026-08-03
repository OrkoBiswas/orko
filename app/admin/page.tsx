import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleCheck, FilePenLine, Images, Inbox, MessageSquareQuote, Plus, Sparkles } from "lucide-react";
import { requireOwner } from "@/lib/admin";
import { inquiryCounts, getSiteContent, listInquiries, listPortfolioProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";
import { cloudinaryStatus } from "@/lib/cloudinary";
import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireOwner("/admin");
  const [counts, managed, recent, content] = await Promise.all([inquiryCounts(), listPortfolioProjects(projects), listInquiries(5), getSiteContent()]);
  const published = managed.filter((item) => item.status === "published").length;
  const featured = managed.filter((item) => item.featured && item.status === "published").length;
  const media = cloudinaryStatus();
  return <AdminShell user={user} eyebrow="Good to see you, Orko" title="Control room" actions={<Link className="admin-primary-action" href="/admin/projects/new"><Plus aria-hidden="true" /> Add project</Link>}>
    <section className="admin-metric-grid"><article><span><BriefcaseBusiness aria-hidden="true" /> Published work</span><strong>{published}</strong><small>of {managed.length} projects live</small></article><article><span><Sparkles aria-hidden="true" /> Featured work</span><strong>{featured}</strong><small>homepage selections</small></article><article><span><MessageSquareQuote aria-hidden="true" /> Testimonials</span><strong>{content.testimonials.length}</strong><small>approved client quotes</small></article><article><span><Inbox aria-hidden="true" /> New inquiries</span><strong>{counts.unread}</strong><small>{counts.total} inquiries overall</small></article><article><span><Images aria-hidden="true" /> Media storage</span><strong>{media.configured ? "Ready" : "Setup"}</strong><small>{media.configured ? "Cloudinary connected" : "one value still needed"}</small></article><article className="is-accent"><span><CircleCheck aria-hidden="true" /> Website status</span><strong>Live</strong><small>public portfolio online</small></article></section>
    <div className="admin-dashboard-grid"><section className="admin-card"><div className="admin-card-head"><div><p className="admin-kicker">Hiring pipeline</p><h2>Latest inquiries</h2></div><Link href="/admin/inquiries">View all <ArrowRight aria-hidden="true" /></Link></div>{recent.length ? <div className="admin-activity-list">{recent.map((inquiry) => <article key={inquiry.id}><span className={`admin-status-dot is-${inquiry.status}`} /><div><strong>{inquiry.name}</strong><p>{inquiry.project_type} · {inquiry.budget}</p></div><time>{new Date(inquiry.created_at).toLocaleDateString("en", { day: "2-digit", month: "short" })}</time></article>)}</div> : <div className="admin-empty">No inquiries yet. New project requests will appear here.</div>}</section><section className="admin-card"><div className="admin-card-head"><div><p className="admin-kicker">Quick actions</p><h2>Manage the website</h2></div></div><div className="admin-quick-links"><Link href="/admin/projects"><BriefcaseBusiness aria-hidden="true" /><span><strong>Manage portfolio</strong><small>Add, edit, reorder, publish, or remove work</small></span><ArrowRight aria-hidden="true" /></Link><Link href="/admin/media"><Images aria-hidden="true" /><span><strong>Open media library</strong><small>Upload files and copy their secure URLs</small></span><ArrowRight aria-hidden="true" /></Link><Link href="/admin/testimonials"><MessageSquareQuote aria-hidden="true" /><span><strong>Edit testimonials</strong><small>Manage approved feedback and credits</small></span><ArrowRight aria-hidden="true" /></Link><Link href="/admin/content"><FilePenLine aria-hidden="true" /><span><strong>Edit public content</strong><small>Hero, profile, contact, social, and SEO</small></span><ArrowRight aria-hidden="true" /></Link></div></section></div>
  </AdminShell>;
}
