import { AdminShell } from "@/components/AdminShell";
import { AdminShowreelManager } from "@/components/AdminShowreelManager";
import { getSiteContent } from "@/db/repository";
import { requireOwner } from "@/lib/admin";
import { cloudinaryStatus } from "@/lib/cloudinary";
import { showreelMedia } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function AdminShowreelPage() {
  const user = await requireOwner("/admin/showreel");
  const content = await getSiteContent();
  const cloudinary = cloudinaryStatus();

  return <AdminShell user={user} eyebrow="Homepage media" title="Showreel">
    <div className="admin-summary-line"><p>Upload, preview, replace, or restore the video playing in the public Showreel section.</p><span>Signed Cloudinary upload</span></div>
    <AdminShowreelManager
      initial={{ showreelVideoUrl: content.showreelVideoUrl, showreelPosterUrl: content.showreelPosterUrl }}
      defaults={{ showreelVideoUrl: showreelMedia.videoUrl, showreelPosterUrl: showreelMedia.posterUrl }}
      cloudinaryConfigured={cloudinary.configured}
    />
  </AdminShell>;
}
