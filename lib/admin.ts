import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "ob_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

export type AdminUser = {
  userId: string;
  username: string;
  displayName: string;
  email: string;
};

type SessionPayload = {
  sub: string;
  sid: string;
  exp: number;
};

function runtimeCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";
  return { username, password, sessionSecret };
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function stringToBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function base64UrlToString(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

async function constantTimeEqual(left: string, right: string) {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(left)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < leftBytes.length; index += 1) difference |= leftBytes[index] ^ rightBytes[index];
  return difference === 0;
}

export function adminAuthConfigured() {
  const credentials = runtimeCredentials();
  return Boolean(credentials.username && credentials.password && credentials.sessionSecret.length >= 32);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const expected = runtimeCredentials();
  if (!adminAuthConfigured()) return false;
  const [usernameMatches, passwordMatches] = await Promise.all([
    constantTimeEqual(username.trim(), expected.username),
    constantTimeEqual(password, expected.password),
  ]);
  return usernameMatches && passwordMatches;
}

export async function createAdminSession(username: string) {
  const { sessionSecret } = runtimeCredentials();
  if (!sessionSecret) throw new Error("ADMIN_AUTH_NOT_CONFIGURED");
  const payload: SessionPayload = {
    sub: username,
    sid: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const encoded = stringToBase64Url(JSON.stringify(payload));
  return `${encoded}.${await hmac(encoded, sessionSecret)}`;
}

async function readSession(token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null;
  const [encoded, suppliedSignature, extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra) return null;
  const { username, sessionSecret } = runtimeCredentials();
  if (!username || !sessionSecret) return null;
  const expectedSignature = await hmac(encoded, sessionSecret);
  if (!(await constantTimeEqual(suppliedSignature, expectedSignature))) return null;
  try {
    const payload = JSON.parse(base64UrlToString(encoded)) as SessionPayload;
    if (payload.sub !== username || payload.exp <= Math.floor(Date.now() / 1000) || !payload.sid) return null;
    return { userId: payload.sid, username, displayName: "Orko Biswas", email: username };
  } catch {
    return null;
  }
}

export async function getOwner() {
  return readSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function requireOwner(returnTo: string) {
  const owner = await getOwner();
  if (!owner) redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
  return owner;
}

export async function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? new URL(request.url).host;
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return origin === `${forwardedProtocol}://${host}`;
}

export function safeAdminReturnTo(value: unknown) {
  return typeof value === "string" && /^\/admin(?:\/|$)/.test(value) && !value.startsWith("//") ? value : "/admin";
}

export const adminSessionMaxAge = SESSION_SECONDS;
