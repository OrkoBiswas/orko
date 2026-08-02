import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminServiceEditor } from "@/components/AdminServiceEditor";
import { AdminShell } from "@/components/AdminShell";
import { getManagedService } from "@/db/repository";
import { requireOwner } from "@/lib/admin";
import { services } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireOwner(`/admin/services/${slug}`);
  const service = await getManagedService(services, slug);
  if (!service) notFound();
  return <AdminShell user={user} eyebrow="Service editor" title={service.title} actions={<><Link className="admin-secondary-action" href="/admin/services"><ArrowLeft aria-hidden="true" /> All services</Link><Link className="admin-primary-action" href={`/services/${service.slug}`} target="_blank">Preview <ExternalLink aria-hidden="true" /></Link></>}><AdminServiceEditor initial={service} originalSlug={slug} /></AdminShell>;
}
