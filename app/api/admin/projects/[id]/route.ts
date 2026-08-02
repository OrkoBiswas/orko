import { NextResponse } from "next/server";
import { z } from "zod";
import { getOwner } from "@/lib/admin";
import { updateProjectStatus } from "@/db/repository";

export const dynamic = "force-dynamic";

const updateSchema = z.object({ status: z.enum(["draft", "published", "archived"]) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Owner sign-in is required." }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Choose a valid project status." }, { status: 422 });
  const { id } = await context.params;
  const updated = await updateProjectStatus(id, parsed.data.status, owner);
  if (!updated) return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  return NextResponse.json({ ok: true, status: parsed.data.status });
}

