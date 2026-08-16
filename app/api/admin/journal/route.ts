import { NextResponse } from "next/server";
import { createManagedJournalPost } from "@/db/repository";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { managedJournalPostSchema } from "@/lib/journal-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 40_000) return NextResponse.json({ ok: false, message: "This journal post is too large. Please shorten it and try again." }, { status: 413 });
  const parsed = managedJournalPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Review the journal post fields and correct any missing or invalid information." }, { status: 422 });
  try {
    const created = await createManagedJournalPost(parsed.data, owner);
    return created ? NextResponse.json({ ok: true, id: parsed.data.id }, { status: 201 }) : NextResponse.json({ ok: false, message: "A journal post already uses this URL slug. Choose a different slug." }, { status: 409 });
  } catch {
    return NextResponse.json({ ok: false, message: "The journal post could not be saved safely." }, { status: 503 });
  }
}
