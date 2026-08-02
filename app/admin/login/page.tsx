import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getOwner, safeAdminReturnTo } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getOwner()) redirect("/admin");
  const params = await searchParams;
  return (
    <div className="admin-login-page">
      <section className="admin-login-brand" aria-label="Orko Biswas portfolio administration">
        <Link href="/" className="admin-login-wordmark"><span>OB</span><strong>Orko Biswas</strong></Link>
        <div><p className="admin-kicker">Private workspace</p><h1>Make every frame<br /><em>work harder.</em></h1><p>Control the portfolio, shape the public story, manage inquiries, and keep every project current from one focused workspace.</p></div>
        <p className="admin-login-foot"><ShieldCheck aria-hidden="true" /> Secure owner access</p>
      </section>
      <section className="admin-login-panel">
        <div className="admin-login-card"><p className="admin-kicker">Welcome back</p><h2>Sign in to the control room</h2><p>Use your private administrator credentials. No ChatGPT account is required.</p><AdminLoginForm next={safeAdminReturnTo(params.next)} /><Link className="admin-back-link" href="/">Return to portfolio <ArrowUpRight aria-hidden="true" /></Link></div>
      </section>
    </div>
  );
}
