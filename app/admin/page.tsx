import { requireOwner } from "@/lib/admin";
import { inquiryCounts, listManagedProjects, seedProjects } from "@/db/repository";
import { projects } from "@/lib/portfolio";
import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const user = await requireOwner("/admin");
  await seedProjects(projects);
  const [counts, managed] = await Promise.all([inquiryCounts(), listManagedProjects()]);
  const published = managed.filter((item) => item.status === "published").length;
  const drafts = managed.filter((item) => item.status === "draft").length;
  const notificationsConfigured = Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_NOTIFICATION_TO && process.env.INQUIRY_FROM_EMAIL);
  return <AdminShell user={user} eyebrow="Orko Biswas / Owner" title="Control room"><section className="admin-metrics"><article><span>Published projects</span><strong>{published}</strong></article><article><span>Draft projects</span><strong>{drafts}</strong></article><article><span>All inquiries</span><strong>{counts.total}</strong></article><article><span>New inquiries</span><strong>{counts.unread}</strong></article></section><section className="admin-section"><div className="admin-section-head"><h2>System readiness</h2></div><table className="admin-table"><thead><tr><th>Capability</th><th>Status</th><th>Note</th></tr></thead><tbody><tr><td>D1 persistence</td><td>Connected</td><td>Inquiries, project status, rate limits, and audit logs</td></tr><tr><td>Owner authentication</td><td>Connected</td><td>ChatGPT-hosted sign-in with optional email allowlist</td></tr><tr><td>Email notification</td><td>{notificationsConfigured ? "Configured" : "Not configured"}</td><td>Inquiry storage works independently of email delivery</td></tr><tr><td>Media upload</td><td>Disabled</td><td>Enable only with a reviewed R2 upload and MIME policy</td></tr></tbody></table></section></AdminShell>;
}
