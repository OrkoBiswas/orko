import { getChatGPTUser, requireChatGPTUser } from "@/app/chatgpt-auth";
import { redirect } from "next/navigation";

function allowedEmails() {
  return (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireOwner(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  const allowlist = allowedEmails();
  if (allowlist.length > 0 && !allowlist.includes(user.email.toLowerCase())) {
    redirect("/admin/access-denied");
  }
  return user;
}

export async function getOwner() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const allowlist = allowedEmails();
  if (allowlist.length > 0 && !allowlist.includes(user.email.toLowerCase())) return null;
  return user;
}
