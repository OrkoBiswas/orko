import { NextResponse } from "next/server";
import { z } from "zod";
import { updateManagedService } from "@/db/repository";
import { getOwner, requireSameOrigin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const serviceSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  number: z.string().trim().min(1).max(10),
  title: z.string().trim().min(1).max(160),
  short: z.string().trim().min(1).max(600),
  promise: z.string().trim().min(1).max(1200),
  deliverables: z.array(z.string().trim().min(1).max(300)).min(1).max(30),
  idealFor: z.array(z.string().trim().min(1).max(300)).min(1).max(30),
  timeline: z.string().trim().min(1).max(200),
  pricing: z.string().trim().min(1).max(200),
  related: z.array(z.string().trim().min(1).max(120)).max(30),
  faqs: z.array(z.object({ question: z.string().trim().min(1).max(400), answer: z.string().trim().min(1).max(1600) })).min(1).max(20),
});

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const parsed = serviceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Review the service fields and keep at least one deliverable, ideal client, and FAQ." }, { status: 422 });
  const { slug } = await context.params;
  try {
    await updateManagedService(slug, parsed.data, owner);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Service changes could not be stored safely." }, { status: 503 });
  }
}
