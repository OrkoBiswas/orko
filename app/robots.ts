import type { MetadataRoute } from "next";
import { getSiteContent } from "@/db/repository";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const content = await getSiteContent();
  const base = (content.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://orkobiswas.com").replace(/\/$/, "");
  return { rules: [{ userAgent: "*", allow: content.searchIndexing ? "/" : undefined, disallow: content.searchIndexing ? ["/admin", "/api"] : "/" }], sitemap: `${base}/sitemap.xml`, host: base };
}
