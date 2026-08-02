import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeRateLimit } from "@/db/repository";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  adminSessionMaxAge,
  createAdminSession,
  safeAdminReturnTo,
  verifyAdminCredentials,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(256),
  next: z.string().optional(),
});

async function fingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const agent = request.headers.get("user-agent") ?? "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`admin-login|${forwarded}|${agent}`));
  return `admin:${Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ ok: false, message: "Admin sign-in is not configured yet." }, { status: 503 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Enter your username and password." }, { status: 422 });

  try {
    if (!(await consumeRateLimit(await fingerprint(request), 7, 15 * 60 * 1000))) {
      return NextResponse.json({ ok: false, message: "Too many sign-in attempts. Please wait 15 minutes and try again." }, { status: 429 });
    }
    if (!(await verifyAdminCredentials(parsed.data.username, parsed.data.password))) {
      return NextResponse.json({ ok: false, message: "The username or password is incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, next: safeAdminReturnTo(parsed.data.next) });
    response.cookies.set(ADMIN_COOKIE, await createAdminSession(parsed.data.username), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: adminSessionMaxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "Sign-in is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
