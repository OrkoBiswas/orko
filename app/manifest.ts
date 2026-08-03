import type { MetadataRoute } from "next";
import { getSiteContent } from "@/db/repository";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const content = await getSiteContent();
  return { name: `${content.name} Portfolio`, short_name: content.name, description: content.seoDescription, start_url: "/", display: "standalone", background_color: "#0b0d0a", theme_color: content.themeColor, icons: content.faviconUrl ? [{ src: content.faviconUrl, sizes: "any", type: "image/png" }] : [] };
}
