import { z } from "zod";

const cloudinaryUrl = z.string().trim().url().max(2000).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}, "Use a secure Cloudinary media URL.");

export const categoryThumbnailSchema = z.object({
  label: z.string().trim().min(1).max(120),
  mediaUrl: cloudinaryUrl,
  mediaType: z.enum(["image", "video"]),
  mediaAlt: z.string().trim().min(1).max(300),
  ratio: z.enum(["wide", "tall", "square", "vertical", "banner"]).default("wide"),
}).strict();

export type CategoryThumbnail = z.infer<typeof categoryThumbnailSchema> & {
  slug: string;
  updatedAt: string;
};
