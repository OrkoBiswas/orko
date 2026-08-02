import Link from "next/link";
import { BarChart3, BriefcaseBusiness, ExternalLink, FilePenLine, Inbox, LayoutDashboard, LogOut, Settings, ShieldCheck } from "lucide-react";
import type { AdminUser } from "@/lib/admin";

const links = [
  ["Overview", "/admin", LayoutDashboard],
  ["Content", "/admin/content", FilePenLine],
  ["Projects", "/admin/projects", BriefcaseBusiness],
  ["Inquiries", "/admin/inquiries", Inbox],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminShell({ user, title, eyebrow, children, actions }: { user: AdminUser; title: string; eyebrow: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin"><span>OB</span><div><strong>Orko Biswas</strong><small>Portfolio OS</small></div></Link>
        <nav className="admin-side-nav" aria-label="Dashboard navigation">{links.map(([label, href, Icon]) => <Link href={href} key={href}><Icon aria-hidden="true" /><span>{label}</span></Link>)}</nav>
        <div className="admin-side-bottom">
          <Link href="/" target="_blank"><ExternalLink aria-hidden="true" /><span>View live website</span></Link>
          <div className="admin-identity"><span>{user.displayName.slice(0, 1)}</span><div><strong>{user.displayName}</strong><small>{user.username}</small></div></div>
          <form action="/api/admin/logout" method="post"><button type="submit"><LogOut aria-hidden="true" /> Sign out</button></form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-workspace-head"><div><p className="admin-kicker">{eyebrow}</p><h1>{title}</h1></div><div className="admin-head-actions">{actions}<span className="admin-secure"><ShieldCheck aria-hidden="true" /> Secure session</span></div></header>
        <div className="admin-mobile-nav">{links.map(([label, href, Icon]) => <Link href={href} key={href} aria-label={label}><Icon aria-hidden="true" /><span>{label}</span></Link>)}</div>
        <div className="admin-workspace-body">{children}</div>
        <footer className="admin-dashboard-foot"><span><BarChart3 aria-hidden="true" /> Portfolio operations</span><span>Changes are saved securely and audit-logged.</span></footer>
      </div>
    </div>
  );
}
