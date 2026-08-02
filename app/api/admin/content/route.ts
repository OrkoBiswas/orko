import { NextResponse } from "next/server";
import { updateSiteContent } from "@/db/repository";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { siteContentSchema } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const parsed = siteContentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Review the highlighted content and complete every required field." }, { status: 422 });
  try {
    await updateSiteContent(parsed.data, owner);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Content could not be stored safely. Please try again." }, { status: 503 });
  }
}
