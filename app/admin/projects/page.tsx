import Link from "next/link";
import { ArrowUpRight, PencilLine, Plus } from "lucide-react";
import { requireOwner } from "@/lib/admin";
import { listPortfolioProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";
import { AdminShell } from "@/components/AdminShell";
import { AdminStatusControl } from "@/components/AdminStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const user = await requireOwner("/admin/projects");
  const managed = await listPortfolioProjects(projects);
  return <AdminShell user={user} eyebrow="Portfolio library" title="Projects" actions={<Link className="admin-primary-action" href="/admin/projects/new"><Plus aria-hidden="true" /> Add project</Link>}><div className="admin-summary-line"><p>Add, edit, publish, archive, preview, or remove any showcase item.</p><span>{managed.length} total projects</span></div><section className="admin-card admin-table-card">{managed.length ? <table className="admin-table"><thead><tr><th>Order</th><th>Project</th><th>Discipline</th><th>Status</th><th>Actions</th></tr></thead><tbody>{managed.map((project) => <tr key={project.id}><td><span className="admin-order">{String(project.displayOrder + 1).padStart(2, "0")}</span></td><td><strong>{project.title}</strong><small>{project.slug}</small></td><td>{project.category}<small>{project.industry} · {project.year}</small></td><td><AdminStatusControl id={project.id} initial={project.status} type="projects" /></td><td><div className="admin-row-actions"><Link href={`/admin/projects/${project.id}`}><PencilLine aria-hidden="true" /> Edit</Link><Link href={`/work/${project.slug}`} target="_blank" aria-label={`Open ${project.title} on the public site`}><ArrowUpRight aria-hidden="true" /></Link></div></td></tr>)}</tbody></table> : <div className="admin-empty">No projects yet. Use Add project to create the first one.</div>}</section></AdminShell>;
}
