import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireOwner } from "@/lib/admin";
import { listPortfolioProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";
import { createProjectTemplate } from "@/lib/project-content";
import { AdminShell } from "@/components/AdminShell";
import { AdminProjectEditor } from "@/components/AdminProjectEditor";

export const dynamic = "force-dynamic";

export default async function NewAdminProjectPage() {
  const user = await requireOwner("/admin/projects/new");
  const managed = await listPortfolioProjects(projects);
  const template = createProjectTemplate(managed.length);
  return <AdminShell user={user} eyebrow="Portfolio library" title="Add project" actions={<Link className="admin-secondary-action" href="/admin/projects"><ArrowLeft aria-hidden="true" /> Back to projects</Link>}><AdminProjectEditor initial={template} mode="create" /></AdminShell>;
}
