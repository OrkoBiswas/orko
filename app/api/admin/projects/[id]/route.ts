import { NextResponse } from "next/server";
import { z } from "zod";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { updateManagedProject, updateProjectStatus } from "@/db/repository";

export const dynamic = "force-dynamic";

const statusSchema = z.object({ status: z.enum(["draft", "published", "archived"]) }).strict();
const projectSchema = z.object({
  id: z.string().min(1).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  index: z.string().trim().min(1).max(10),
  category: z.string().trim().min(1).max(100),
  services: z.array(z.string().trim().min(1).max(100)).min(1).max(20),
  industry: z.string().trim().min(1).max(100),
  client: z.string().trim().min(1).max(160),
  year: z.number().int().min(2000).max(2100),
  featured: z.boolean(),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  visual: z.enum(["orbit", "signal", "editorial", "spectrum", "type", "frame"]),
  ratio: z.enum(["wide", "tall", "square"]),
  summary: z.string().trim().min(1).max(1000),
  challenge: z.string().trim().min(1).max(2000),
  concept: z.string().trim().min(1).max(2000),
  approach: z.array(z.string().trim().min(1).max(300)).min(1).max(20),
  deliverables: z.array(z.string().trim().min(1).max(300)).min(1).max(30),
  tools: z.array(z.string().trim().min(1).max(100)).min(1).max(30),
  status: z.enum(["draft", "published", "archived"]),
  displayOrder: z.number().int().min(0).max(999),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const { id } = await context.params;
  const statusOnly = statusSchema.safeParse(body);
  let updated: boolean;
  let nextStatus: string;
  if (statusOnly.success) {
    updated = await updateProjectStatus(id, statusOnly.data.status, owner);
    nextStatus = statusOnly.data.status;
  } else {
    const detailed = projectSchema.safeParse(body);
    if (!detailed.success) return NextResponse.json({ ok: false, message: "Review the project fields and correct any missing or invalid information." }, { status: 422 });
    if (detailed.data.id !== id) return NextResponse.json({ ok: false, message: "The project identity does not match this record." }, { status: 409 });
    updated = await updateManagedProject(id, detailed.data, owner);
    nextStatus = detailed.data.status;
  }
  if (!updated) return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
  return NextResponse.json({ ok: true, status: nextStatus });
}
