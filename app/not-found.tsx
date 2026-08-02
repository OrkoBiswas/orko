import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
export default function NotFound() { return <section className="not-found"><div><span>404 / FRAME NOT FOUND</span><h1>Lost the<br />cut.</h1><p>This route is not in the current edit. Return to the archive or start again from the opening frame.</p><div style={{ display: "flex", gap: 12, marginTop: 30, justifyContent: "center", flexWrap: "wrap" }}><Link className="button button-accent" href="/"><ArrowLeft aria-hidden="true" /> Home</Link><Link className="button button-ghost" href="/work">Work archive <ArrowRight aria-hidden="true" /></Link></div></div></section>; }

