import { AdminContentForm } from "@/components/AdminContentForm";
import { AdminShell } from "@/components/AdminShell";
import { getSiteContent } from "@/db/repository";
import { requireOwner } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const user = await requireOwner("/admin/content");
  const content = await getSiteContent();
  return <AdminShell user={user} eyebrow="Website editor" title="Content"><AdminContentForm initial={content} /></AdminShell>;
}
