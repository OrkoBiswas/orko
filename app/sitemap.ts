import type { MetadataRoute } from "next";
import { getSiteContent, listPortfolioProjects, listPortfolioServices } from "@/db/repository";
import { projects, services } from "@/lib/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, liveProjects, liveServices] = await Promise.all([getSiteContent(), listPortfolioProjects(projects, { publishedOnly: true }), listPortfolioServices(services)]);
  const base = (content.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://orkobiswas.com").replace(/\/$/, "");
  const now = new Date();
  const routes = ["", "/work", "/services", "/about", "/process", "/showreel", "/contact", "/start-a-project", "/resume", "/privacy", "/terms"];
  return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: now, changeFrequency: route === "/work" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })), ...liveProjects.map((project) => ({ url: `${base}/work/${project.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .8 })), ...liveServices.map((service) => ({ url: `${base}/services/${service.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .75 }))];
}
