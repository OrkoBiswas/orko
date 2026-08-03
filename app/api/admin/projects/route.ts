import { NextResponse } from "next/server";
import { createManagedProject } from "@/db/repository";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { managedProjectSchema } from "@/lib/project-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const parsed = managedProjectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Review the project fields and correct any missing or invalid information." }, { status: 422 });
  try {
    const created = await createManagedProject(parsed.data, owner);
    return created ? NextResponse.json({ ok: true, id: parsed.data.id }, { status: 201 }) : NextResponse.json({ ok: false, message: "A project already uses this URL slug. Choose a different slug." }, { status: 409 });
  } catch {
    return NextResponse.json({ ok: false, message: "The project could not be created safely." }, { status: 503 });
  }
}
