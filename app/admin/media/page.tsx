import { AdminMediaLibrary } from "@/components/AdminMediaLibrary";
import { AdminShell } from "@/components/AdminShell";
import { requireOwner } from "@/lib/admin";
import { cloudinaryStatus } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const user = await requireOwner("/admin/media");
  const status = cloudinaryStatus();
  return <AdminShell user={user} eyebrow="Cloud media workspace" title="Media library"><div className="admin-summary-line"><p>Upload, review, copy, and remove the files used across your portfolio.</p><span>Cloudinary storage</span></div><AdminMediaLibrary initiallyConfigured={status.configured} initialMissing={status.missing} /></AdminShell>;
}
