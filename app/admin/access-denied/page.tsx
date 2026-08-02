import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export const dynamic = "force-dynamic";
export default function AccessDeniedPage() { return <section className="not-found"><div><span>OWNER ACCESS</span><h1>Not on<br />the list.</h1><p>You are signed in, but this identity is not authorized for the owner area. Ask the site owner to add your email to the server-side allowlist.</p><Link className="button button-accent" href="/"><ArrowLeft aria-hidden="true" /> Return to site</Link></div></section>; }
