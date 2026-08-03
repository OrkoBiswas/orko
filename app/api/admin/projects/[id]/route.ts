import { NextResponse } from "next/server";
import { z } from "zod";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { deleteManagedProject, updateManagedProject, updateProjectStatus } from "@/db/repository";
import { managedProjectSchema } from "@/lib/project-content";

export const dynamic = "force-dynamic";

const statusSchema = z.object({ status: z.enum(["draft", "published", "archived"]) }).strict();
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const { id } = await context.params;
  try {
    const statusOnly = statusSchema.safeParse(body);
    let updated: boolean;
    let nextStatus: string;
    if (statusOnly.success) {
      updated = await updateProjectStatus(id, statusOnly.data.status, owner);
      nextStatus = statusOnly.data.status;
    } else {
      const detailed = managedProjectSchema.safeParse(body);
      if (!detailed.success) return NextResponse.json({ ok: false, message: "Review the project fields and correct any missing or invalid information." }, { status: 422 });
      if (detailed.data.id !== id) return NextResponse.json({ ok: false, message: "The project identity does not match this record." }, { status: 409 });
      updated = await updateManagedProject(id, detailed.data, owner);
      nextStatus = detailed.data.status;
    }
    if (!updated) return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
    return NextResponse.json({ ok: true, status: nextStatus });
  } catch {
    return NextResponse.json({ ok: false, message: "The project could not be updated safely. Check that its URL slug is unique." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const { id } = await context.params;
  try {
    const deleted = await deleteManagedProject(id, owner);
    return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, message: "The project could not be removed safely." }, { status: 503 });
  }
}
