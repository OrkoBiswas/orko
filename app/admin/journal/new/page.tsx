import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminJournalEditor } from "@/components/AdminJournalEditor";
import { AdminShell } from "@/components/AdminShell";
import { listJournalPosts } from "@/db/repository";
import { requireOwner } from "@/lib/admin";
import { createJournalPostTemplate } from "@/lib/journal-content";

export const dynamic = "force-dynamic";

export default async function NewAdminJournalPage() {
  const user = await requireOwner("/admin/journal/new");
  const posts = await listJournalPosts();
  return <AdminShell user={user} eyebrow="Publishing portal" title="New journal post" actions={<Link className="admin-secondary-action" href="/admin/journal"><ArrowLeft aria-hidden="true" /> Back to journal</Link>}><AdminJournalEditor initial={{ ...createJournalPostTemplate(posts.length), createdAt: "", updatedAt: "" }} mode="create" /></AdminShell>;
}
