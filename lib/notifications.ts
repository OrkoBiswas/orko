import type { InquiryInput } from "@/lib/inquiry";

export async function sendInquiryNotifications(input: InquiryInput, reference: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminTo = process.env.INQUIRY_NOTIFICATION_TO;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !adminTo || !from) return { configured: false };

  const subject = `New portfolio inquiry ${reference}`;
  const summary = [
    `Reference: ${reference}`,
    `From: ${input.name} <${input.email}>`,
    `Project: ${input.projectType}`,
    `Timeline: ${input.timeline}`,
    `Budget: ${input.budget}`,
    "",
    input.details,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [adminTo],
      subject,
      text: summary,
      reply_to: input.email,
    }),
  });

  if (!response.ok) throw new Error("NOTIFICATION_FAILED");
  return { configured: true };
}
