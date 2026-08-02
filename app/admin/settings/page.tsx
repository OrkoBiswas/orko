import { BellRing, Check, Database, KeyRound, ShieldCheck } from "lucide-react";
import { requireOwner, adminAuthConfigured } from "@/lib/admin";
import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requireOwner("/admin/settings");
  const notificationsConfigured = Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_NOTIFICATION_TO && process.env.INQUIRY_FROM_EMAIL);
  const settings = [
    { icon: KeyRound, title: "Administrator sign-in", value: adminAuthConfigured() ? "Configured" : "Needs configuration", note: "Private username/password authentication with a signed eight-hour session." },
    { icon: ShieldCheck, title: "Dashboard protection", value: "Active", note: "HTTP-only secure cookies, same-origin mutations, and rate-limited login attempts." },
    { icon: Database, title: "Portfolio database", value: "Connected", note: "Public content, projects, inquiries, and audit history are stored durably." },
    { icon: BellRing, title: "Email notifications", value: notificationsConfigured ? "Configured" : "Storage only", note: notificationsConfigured ? "New inquiries can trigger notification delivery." : "Inquiries are saved safely even without an email provider." },
  ];
  return <AdminShell user={user} eyebrow="Workspace configuration" title="Settings"><section className="admin-settings-grid">{settings.map(({ icon: Icon, title, value, note }) => <article className="admin-card" key={title}><div className="admin-settings-icon"><Icon aria-hidden="true" /></div><div><p className="admin-kicker">{title}</p><h2><Check aria-hidden="true" /> {value}</h2><p>{note}</p></div></article>)}</section><section className="admin-card admin-security-note"><div><ShieldCheck aria-hidden="true" /></div><div><p className="admin-kicker">Security policy</p><h2>Credentials stay outside the website source.</h2><p>The administrator password and session-signing key are stored as protected hosting secrets. They are never rendered in the dashboard, committed to the codebase, or returned by an API.</p></div></section></AdminShell>;
}
