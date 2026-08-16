import Link from "next/link";
import { ArrowUpRight, BookOpenText, FileCode2, PencilLine, Plus, Radio, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { journalCounts, listJournalPosts } from "@/db/repository";
import { requireOwner } from "@/lib/admin";
import { journalCategories } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const user = await requireOwner("/admin/journal");
  const [posts, counts] = await Promise.all([listJournalPosts(), journalCounts()]);
  const newest = [...posts].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 3);
  return (
    <AdminShell user={user} eyebrow="Publishing portal" title="Journal" actions={<Link className="admin-primary-action" href="/admin/journal/new"><Plus aria-hidden="true" /> New journal post</Link>}>
      <section className="admin-journal-dashboard">
        <div className="admin-journal-dashboard-main">
          <p className="admin-kicker">Creative portal</p>
          <h2>Share more than the <em>finished frame.</em></h2>
          <p>Publish studio news, save useful editing methods, and attach public development files from one protected publishing workspace.</p>
          <div><Link href="/admin/journal/new"><Sparkles aria-hidden="true" /> Write a new post</Link><Link href="/journal" target="_blank">Open public portal <ArrowUpRight aria-hidden="true" /></Link></div>
        </div>
        <div className="admin-journal-dashboard-stats">
          <article><span><Radio aria-hidden="true" /> Published</span><strong>{String(counts.published).padStart(2, "0")}</strong><small>visible in the public journal</small></article>
          <article><span><FileCode2 aria-hidden="true" /> Drafts</span><strong>{String(counts.drafts).padStart(2, "0")}</strong><small>private ideas in progress</small></article>
          <article><span><BookOpenText aria-hidden="true" /> Total notes</span><strong>{String(counts.total).padStart(2, "0")}</strong><small>across all portal sections</small></article>
        </div>
      </section>
      <section className="admin-journal-channel-grid" aria-label="Journal channels">
        {journalCategories.map((category) => {
          const matching = posts.filter((post) => post.category === category.value);
          return <article key={category.value}><span>{String(matching.length).padStart(2, "0")}</span><h2>{category.label}</h2><p>{category.description}</p><Link href="/admin/journal/new">Add note <Plus aria-hidden="true" /></Link></article>;
        })}
      </section>
      <section className="admin-card admin-table-card">
        <div className="admin-card-head"><div><p className="admin-kicker">Publishing queue</p><h2>Every journal note</h2></div><span>{posts.length} managed post{posts.length === 1 ? "" : "s"}</span></div>
        {posts.length ? (
          <table className="admin-table"><thead><tr><th>Post</th><th>Channel</th><th>Visibility</th><th>Resources</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
            {posts.map((post) => <tr key={post.id}><td><strong>{post.title}</strong><small>{post.slug}</small></td><td>{journalCategories.find((category) => category.value === post.category)?.label}</td><td><span className={`admin-journal-status is-${post.status}`}>{post.status}</span>{post.featured && <small>Featured</small>}</td><td>{post.files.length} file{post.files.length === 1 ? "" : "s"}</td><td>{new Date(post.updatedAt).toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" })}</td><td><div className="admin-row-actions"><Link href={`/admin/journal/${post.id}`}><PencilLine aria-hidden="true" /> Edit</Link>{post.status === "published" && <Link href={`/journal/${post.slug}`} target="_blank" aria-label={`Open ${post.title} on the public site`}><ArrowUpRight aria-hidden="true" /></Link>}</div></td></tr>)}
          </tbody></table>
        ) : <div className="admin-empty"><BookOpenText aria-hidden="true" /><h3>Your journal is ready for its first note.</h3><p>Start with a current creative thought, a repeatable technique, or a useful development resource.</p><Link className="admin-primary-action" href="/admin/journal/new"><Plus aria-hidden="true" /> Create first post</Link></div>}
      </section>
      {newest.length > 0 && <section className="admin-journal-recent"><div><p className="admin-kicker">Recently changed</p><h2>Keep the portal <em>moving.</em></h2></div><div>{newest.map((post) => <Link href={`/admin/journal/${post.id}`} key={post.id}><span>{journalCategories.find((category) => category.value === post.category)?.label}</span><strong>{post.title}</strong><small>Updated {new Date(post.updatedAt).toLocaleDateString("en", { day: "numeric", month: "short" })}</small><ArrowUpRight aria-hidden="true" /></Link>)}</div></section>}
    </AdminShell>
  );
}
