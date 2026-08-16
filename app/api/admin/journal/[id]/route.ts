import { NextResponse } from "next/server";
import { deleteManagedJournalPost, updateManagedJournalPost } from "@/db/repository";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { managedJournalPostSchema } from "@/lib/journal-content";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 40_000) return NextResponse.json({ ok: false, message: "This journal post is too large. Please shorten it and try again." }, { status: 413 });
  const { id } = await context.params;
  const parsed = managedJournalPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Review the journal post fields and correct any missing or invalid information." }, { status: 422 });
  if (parsed.data.id !== id) return NextResponse.json({ ok: false, message: "The journal post identity does not match this record." }, { status: 409 });
  try {
    const updated = await updateManagedJournalPost(id, parsed.data, owner);
    if (updated === null) return NextResponse.json({ ok: false, message: "Journal post not found." }, { status: 404 });
    if (!updated) return NextResponse.json({ ok: false, message: "A journal post already uses this URL slug. Choose a different slug." }, { status: 409 });
    return NextResponse.json({ ok: true, status: parsed.data.status });
  } catch {
    return NextResponse.json({ ok: false, message: "The journal post could not be updated safely." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const { id } = await context.params;
  try {
    const deleted = await deleteManagedJournalPost(id, owner);
    return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, message: "Journal post not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, message: "The journal post could not be removed safely." }, { status: 503 });
  }
}
