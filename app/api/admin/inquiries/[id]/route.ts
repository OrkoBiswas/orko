import { NextResponse } from "next/server";
import { z } from "zod";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { updateInquiryStatus } from "@/db/repository";

export const dynamic = "force-dynamic";

const updateSchema = z.object({ status: z.enum(["new", "reviewing", "qualified", "discussion", "proposal-sent", "won", "declined", "archived"]) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Choose a valid inquiry status." }, { status: 422 });
  const { id } = await context.params;
  const updated = await updateInquiryStatus(id, parsed.data.status, owner);
  if (!updated) return NextResponse.json({ ok: false, message: "Inquiry not found." }, { status: 404 });
  return NextResponse.json({ ok: true, status: parsed.data.status });
}
