import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireOwner } from "@/lib/admin";
import { listPortfolioProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";
import { createProjectTemplate } from "@/lib/project-content";
import { AdminShell } from "@/components/AdminShell";
import { AdminProjectEditor } from "@/components/AdminProjectEditor";

export const dynamic = "force-dynamic";

type NewProjectSearchParams = Promise<Record<string, string | string[] | undefined>>;
function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }

export default async function NewAdminProjectPage({ searchParams }: { searchParams: NewProjectSearchParams }) {
  const user = await requireOwner("/admin/projects/new");
  const managed = await listPortfolioProjects(projects);
  const requested = await searchParams;
  const category = first(requested.category).trim();
  const template = createProjectTemplate(managed.length, category);
  return <AdminShell user={user} eyebrow="Portfolio library" title={category ? "Add " + category : "Add project"} actions={<Link className="admin-secondary-action" href="/admin/projects"><ArrowLeft aria-hidden="true" /> Back to projects</Link>}><AdminProjectEditor initial={template} mode="create" /></AdminShell>;
}
