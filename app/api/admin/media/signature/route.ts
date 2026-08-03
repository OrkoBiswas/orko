import { NextResponse } from "next/server";
import { createCloudinaryUploadSignature } from "@/lib/cloudinary";
import { getOwner, requireSameOrigin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  try {
    return NextResponse.json({ ok: true, ...(await createCloudinaryUploadSignature()) });
  } catch {
    return NextResponse.json({ ok: false, message: "Cloudinary is not fully configured yet." }, { status: 503 });
  }
}
