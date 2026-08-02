import { NextResponse } from "next/server";
import { createInquiryReference, inquirySchema } from "@/lib/inquiry";
import { consumeRateLimit, saveInquiry } from "@/db/repository";
import { sendInquiryNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

async function fingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const encoded = new TextEncoder().encode(`${forwarded}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_000) {
    return NextResponse.json({ ok: false, message: "That project brief is too large. Please shorten the details and try again." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "The inquiry could not be read. Please refresh and try again." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please review the highlighted information.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const key = await fingerprint(request);
    if (!(await consumeRateLimit(key))) {
      return NextResponse.json({ ok: false, message: "Too many inquiries were sent from this connection. Please wait an hour and try again." }, { status: 429 });
    }

    const reference = createInquiryReference();
    await saveInquiry(parsed.data, reference);
    let notificationSent = false;
    try {
      notificationSent = (await sendInquiryNotifications(parsed.data, reference)).configured;
    } catch {
      // The durable inquiry is already stored; notification failure must not erase it.
    }

    return NextResponse.json(
      {
        ok: true,
        reference,
        notificationSent,
        message: `Your project brief is safely recorded as ${reference}. Orko will review it and reply soon.`,
      },
      { status: 201 },
    );
  } catch (error) {
    const unavailable = error instanceof Error && error.message === "DATABASE_UNAVAILABLE";
    return NextResponse.json(
      {
        ok: false,
        message: unavailable
          ? "The secure inquiry service is temporarily unavailable. Your form is still here—please copy the details and try again shortly."
          : "The inquiry could not be stored safely. Nothing was submitted; please try again.",
      },
      { status: 503 },
    );
  }
}

