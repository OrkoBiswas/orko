import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminProjectEditor } from "@/components/AdminProjectEditor";
import { AdminShell } from "@/components/AdminShell";
import { getManagedProject } from "@/db/repository";
import { requireOwner } from "@/lib/admin";
import { projects } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireOwner(`/admin/projects/${id}`);
  const project = await getManagedProject(projects, id);
  if (!project) notFound();
  return <AdminShell user={user} eyebrow="Project editor" title={project.title} actions={<><Link className="admin-secondary-action" href="/admin/projects"><ArrowLeft aria-hidden="true" /> All projects</Link><Link className="admin-primary-action" href={`/work/${project.slug}`} target="_blank">Preview <ExternalLink aria-hidden="true" /></Link></>}><AdminProjectEditor initial={project} /></AdminShell>;
}
