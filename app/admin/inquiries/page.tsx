import { requireOwner } from "@/lib/admin";
import { listInquiries } from "@/db/repository";
import { AdminShell } from "@/components/AdminShell";
import { AdminStatusControl } from "@/components/AdminStatusControl";

export const dynamic = "force-dynamic";
export default async function AdminInquiriesPage() { const user = await requireOwner("/admin/inquiries"); const inquiries = await listInquiries(); return <AdminShell user={user} eyebrow="Hiring pipeline" title="Inquiries"><section className="admin-section">{inquiries.length ? <table className="admin-table"><thead><tr><th>Received</th><th>Reference</th><th>Contact</th><th>Project</th><th>Timing / budget</th><th>Details</th><th>Status</th></tr></thead><tbody>{inquiries.map((inquiry) => <tr key={inquiry.id}><td>{new Date(inquiry.created_at).toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" })}</td><td><strong>{inquiry.reference}</strong><br />{inquiry.pathway}</td><td>{inquiry.name}<br /><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>{inquiry.company && <><br />{inquiry.company}</>}</td><td>{inquiry.project_type}</td><td>{inquiry.timeline}<br />{inquiry.budget}</td><td style={{ maxWidth: 320, whiteSpace: "normal" }}>{inquiry.details}</td><td><AdminStatusControl id={inquiry.id} initial={inquiry.status} type="inquiries" /></td></tr>)}</tbody></table> : <div className="admin-empty">No inquiries yet. New contact and guided-brief submissions will appear here after secure storage succeeds.</div>}</section></AdminShell>; }

