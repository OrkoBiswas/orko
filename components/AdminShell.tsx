import Link from "next/link";
import { chatGPTSignOutPath, type ChatGPTUser } from "@/app/chatgpt-auth";

const links = [["Overview","/admin"],["Projects","/admin/projects"],["Inquiries","/admin/inquiries"],["Settings","/admin/settings"],["View site","/"]] as const;
export function AdminShell({ user, title, eyebrow, children }: { user: ChatGPTUser; title: string; eyebrow: string; children: React.ReactNode }) {
  return <div className="admin-shell"><header className="admin-top"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div><div><p>{user.displayName}<br />{user.email}</p><Link className="text-link" href={chatGPTSignOutPath("/")}>Sign out</Link></div></header><nav className="admin-nav" aria-label="Owner navigation">{links.map(([label,href]) => <Link href={href} key={href}>{label}</Link>)}</nav>{children}</div>;
}
