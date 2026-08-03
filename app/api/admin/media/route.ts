import { NextResponse } from "next/server";
import { z } from "zod";
import { cloudinaryStatus, deleteCloudinaryAsset, listCloudinaryAssets } from "@/lib/cloudinary";
import { getOwner, requireSameOrigin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const deleteSchema = z.object({
  publicId: z.string().trim().min(1).max(500),
  resourceType: z.enum(["image", "video", "raw"]),
}).strict();

export async function GET() {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  const status = cloudinaryStatus();
  if (!status.configured) return NextResponse.json({ ok: true, configured: false, missing: status.missing, assets: [] });
  try {
    return NextResponse.json({ ok: true, configured: true, assets: await listCloudinaryAssets() });
  } catch {
    return NextResponse.json({ ok: false, configured: true, message: "The media library could not be loaded. Check the Cloudinary connection and try again." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "The selected media item is invalid." }, { status: 422 });
  try {
    const deleted = await deleteCloudinaryAsset(parsed.data.publicId, parsed.data.resourceType);
    return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, message: "Cloudinary did not confirm the deletion." }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, message: "The media item could not be deleted safely." }, { status: 502 });
  }
}
