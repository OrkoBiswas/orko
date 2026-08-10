import Link from "next/link";
import { ArrowUpRight, Images, PencilLine, Plus } from "lucide-react";
import { requireOwner } from "@/lib/admin";
import { listPortfolioProjects } from "@/db/repository";
import { projectCategoryWorkCount, projects, showcaseCategories } from "@/lib/portfolio";
import { AdminShell } from "@/components/AdminShell";
import { AdminStatusControl } from "@/components/AdminStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const user = await requireOwner("/admin/projects");
  const managed = await listPortfolioProjects(projects);
  const categoryShelves = showcaseCategories.map((category) => {
    const categoryProjects = managed.filter((project) => projectCategoryWorkCount(project, category.value) > 0);
    const blockCount = categoryProjects.reduce((total, project) => total + (project.contentBlocks?.length || (project.gallery ?? []).filter((item) => item.url !== project.mediaUrl).length), 0);
    return { ...category, projectCount: categoryProjects.length, blockCount };
  });

  return <AdminShell user={user} eyebrow="Portfolio library" title="Projects" actions={<Link className="admin-primary-action" href="/admin/projects/new"><Plus aria-hidden="true" /> Add project</Link>}>
    <div className="admin-summary-line"><p>Organize complete Behance-style projects inside the seven public category shelves.</p><span>{managed.length} total projects</span></div>
    <section className="admin-category-library" aria-labelledby="admin-category-heading">
      <div className="admin-category-library-head"><div><p className="admin-kicker">Category system</p><h2 id="admin-category-heading">Seven public work shelves</h2></div><p>Each published category thumbnail opens a complete ordered project presentation.</p></div>
      <div className="admin-category-grid">{categoryShelves.map((category, index) => <article className="admin-category-card" key={category.value}>
        <div className="admin-category-card-top"><span>{String(index + 1).padStart(2, "0")}</span><Images aria-hidden="true" /></div>
        <h3>{category.label}</h3><p>{category.description}</p>
        <dl><div><dt>Projects</dt><dd>{String(category.projectCount).padStart(2, "0")}</dd></div><div><dt>Blocks</dt><dd>{String(category.blockCount).padStart(2, "0")}</dd></div></dl>
        <div className="admin-category-actions"><Link href={`/admin/projects/new?category=${category.value}`}><Plus aria-hidden="true" /> Add project</Link><Link href={`/work/category/${category.value}`} target="_blank">View public <ArrowUpRight aria-hidden="true" /></Link></div>
      </article>)}</div>
    </section>
    <section className="admin-card admin-table-card">{managed.length ? <table className="admin-table"><thead><tr><th>Order</th><th>Project</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead><tbody>{managed.map((project) => <tr key={project.id}>
      <td><span className="admin-order">{String(project.displayOrder + 1).padStart(2, "0")}</span></td>
      <td><strong>{project.title}</strong><small>{project.slug}</small></td>
      <td>{project.category}<small>{project.industry} · {project.year} · {project.contentBlocks?.length ?? 0} blocks</small></td>
      <td><AdminStatusControl id={project.id} initial={project.status} type="projects" /></td>
      <td><div className="admin-row-actions"><Link href={`/admin/projects/${project.id}`}><PencilLine aria-hidden="true" /> Edit</Link><Link href={`/work/${project.slug}`} target="_blank" aria-label={`Open ${project.title} on the public site`}><ArrowUpRight aria-hidden="true" /></Link></div></td>
    </tr>)}</tbody></table> : <div className="admin-empty">No projects yet. Choose a category above or use Add project to create the first one.</div>}</section>
  </AdminShell>;
}
