import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteCategoryThumbnail, updateCategoryThumbnail } from "@/db/repository";
import { getOwner, requireSameOrigin } from "@/lib/admin";
import { categoryThumbnailSchema } from "@/lib/category-content";

export const dynamic = "force-dynamic";

const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const { slug: rawSlug } = await context.params;
  const slug = slugSchema.safeParse(rawSlug);
  const input = categoryThumbnailSchema.safeParse(await request.json().catch(() => null));
  if (!slug.success || !input.success) return NextResponse.json({ ok: false, message: "Choose a valid Cloudinary image or video for this category." }, { status: 422 });
  try {
    const thumbnail = await updateCategoryThumbnail(slug.data, input.data, owner);
    return NextResponse.json({ ok: true, thumbnail });
  } catch {
    return NextResponse.json({ ok: false, message: "The category thumbnail could not be saved safely." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ ok: false, message: "Your secure session has expired. Sign in again." }, { status: 401 });
  if (!(await requireSameOrigin(request))) return NextResponse.json({ ok: false, message: "The request origin could not be verified." }, { status: 403 });
  const { slug: rawSlug } = await context.params;
  const slug = slugSchema.safeParse(rawSlug);
  if (!slug.success) return NextResponse.json({ ok: false, message: "The category could not be identified." }, { status: 422 });
  try {
    const removed = await deleteCategoryThumbnail(slug.data, owner);
    return NextResponse.json({ ok: true, removed });
  } catch {
    return NextResponse.json({ ok: false, message: "The category thumbnail could not be removed safely." }, { status: 503 });
  }
}
