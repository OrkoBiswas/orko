import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().default("");

export const inquirySchema = z.object({
  pathway: z.enum(["contact", "brief"]),
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(180),
  company: optionalText,
  phone: z.string().trim().max(40).optional().default(""),
  country: optionalText,
  timezone: optionalText,
  communication: optionalText,
  projectType: z.string().trim().min(1, "Choose the kind of project.").max(100),
  goals: z.array(z.string().trim().max(100)).max(12).optional().default([]),
  deliverables: z.array(z.string().trim().max(100)).max(20).optional().default([]),
  materials: z.array(z.string().trim().max(100)).max(20).optional().default([]),
  style: z.array(z.string().trim().max(100)).max(12).optional().default([]),
  timeline: z.string().trim().min(1, "Choose a timeline.").max(100),
  budget: z.string().trim().min(1, "Choose a budget range.").max(100),
  details: z.string().trim().min(20, "Share at least 20 characters about the project.").max(5000),
  consent: z.literal(true, { message: "Consent is required to submit this inquiry." }),
  website: z.string().max(0, "Spam check failed.").optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export function createInquiryReference(now = new Date()) {
  const year = now.getUTCFullYear();
  const token = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `OB-${year}-${token}`;
}

