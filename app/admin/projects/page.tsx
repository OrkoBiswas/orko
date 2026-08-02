import Link from "next/link";
import { requireOwner } from "@/lib/admin";
import { listManagedProjects, seedProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";
import { AdminShell } from "@/components/AdminShell";
import { AdminStatusControl } from "@/components/AdminStatusControl";

export const dynamic = "force-dynamic";
export default async function AdminProjectsPage() { const user = await requireOwner("/admin/projects"); await seedProjects(projects); const managed = await listManagedProjects(); return <AdminShell user={user} eyebrow="Portfolio management" title="Projects"><p className="admin-notice">Publication status is durable and audit-logged. Project narrative content remains source-controlled until the richer editor and media workflow are enabled.</p><section className="admin-section"><table className="admin-table"><thead><tr><th>Order</th><th>Project</th><th>Slug</th><th>Status</th><th>Public view</th></tr></thead><tbody>{managed.map((project) => <tr key={project.id}><td>{String(project.display_order + 1).padStart(2,"0")}</td><td><strong>{project.title}</strong></td><td>{project.slug}</td><td><AdminStatusControl id={project.id} initial={project.status} type="projects" /></td><td><Link className="text-link" href={`/work/${project.slug}`}>Open</Link></td></tr>)}</tbody></table></section></AdminShell>; }

