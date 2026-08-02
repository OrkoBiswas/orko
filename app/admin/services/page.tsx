import Link from "next/link";
import { ArrowUpRight, PencilLine } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { listPortfolioServices } from "@/db/repository";
import { requireOwner } from "@/lib/admin";
import { services } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const user = await requireOwner("/admin/services");
  const managed = await listPortfolioServices(services);
  return <AdminShell user={user} eyebrow="Commercial offer" title="Services"><div className="admin-summary-line"><p>Shape every service promise, deliverable list, client fit, timeline, pricing note, related work, and FAQ.</p><span>{managed.length} active services</span></div><section className="admin-card admin-table-card"><table className="admin-table"><thead><tr><th>Order</th><th>Service</th><th>Offer</th><th>Actions</th></tr></thead><tbody>{managed.map((service) => <tr key={service.slug}><td><span className="admin-order">{service.number}</span></td><td><strong>{service.title}</strong><small>{service.slug}</small></td><td>{service.timeline}<small>{service.pricing}</small></td><td><div className="admin-row-actions"><Link href={`/admin/services/${service.slug}`}><PencilLine aria-hidden="true" /> Edit</Link><Link href={`/services/${service.slug}`} target="_blank" aria-label={`Open ${service.title} on the public site`}><ArrowUpRight aria-hidden="true" /></Link></div></td></tr>)}</tbody></table></section></AdminShell>;
}
