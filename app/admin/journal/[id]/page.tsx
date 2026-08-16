import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminJournalEditor } from "@/components/AdminJournalEditor";
import { AdminShell } from "@/components/AdminShell";
import { getManagedJournalPost } from "@/db/repository";
import { requireOwner } from "@/lib/admin";

export const dynamic = "force-dynamic";
type Params = Promise<{ id: string }>;

export default async function AdminJournalPostPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await requireOwner(`/admin/journal/${id}`);
  const post = await getManagedJournalPost(id);
  if (!post) notFound();
  return <AdminShell user={user} eyebrow="Publishing portal" title={post.title} actions={<><Link className="admin-secondary-action" href="/admin/journal"><ArrowLeft aria-hidden="true" /> All journal posts</Link>{post.status === "published" && <Link className="admin-primary-action" href={`/journal/${post.slug}`} target="_blank">Preview <ExternalLink aria-hidden="true" /></Link>}</>}><AdminJournalEditor initial={post} /></AdminShell>;
}
