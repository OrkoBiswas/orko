import type { MetadataRoute } from "next";
import { getSiteContent, listJournalPosts, listPortfolioProjects, listPortfolioServices } from "@/db/repository";
import { deriveShowcaseCategories, projects, services } from "@/lib/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, liveProjects, liveServices, journal] = await Promise.all([getSiteContent(), listPortfolioProjects(projects, { publishedOnly: true }), listPortfolioServices(services), listJournalPosts({ publishedOnly: true })]);
  const base = (content.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://orkobiswas.com").replace(/\/$/, "");
  const now = new Date();
  const showcaseCategories = deriveShowcaseCategories(liveProjects);
  const routes = ["", "/work", "/services", "/about", "/journal", "/showreel", "/contact", "/start-a-project", "/resume", "/privacy", "/terms"];
  return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: now, changeFrequency: route === "/work" || route === "/journal" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })), ...showcaseCategories.map((category) => ({ url: `${base}/work/category/${category.value}`, lastModified: now, changeFrequency: "weekly" as const, priority: .85 })), ...liveProjects.map((project) => ({ url: `${base}/work/${project.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .8 })), ...liveServices.map((service) => ({ url: `${base}/services/${service.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .75 })), ...journal.map((post) => ({ url: `${base}/journal/${post.slug}`, lastModified: new Date(post.updatedAt), changeFrequency: "monthly" as const, priority: .7 }))];
}
