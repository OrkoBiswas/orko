import type { MetadataRoute } from "next";
import { projects, services } from "@/lib/portfolio";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://orkobiswas.com";
  const routes = ["", "/work", "/services", "/about", "/process", "/showreel", "/contact", "/start-a-project", "/resume", "/privacy", "/terms"];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "/work" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })), ...projects.map((project) => ({ url: `${base}/work/${project.slug}`, changeFrequency: "monthly" as const, priority: .8 })), ...services.map((service) => ({ url: `${base}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: .7 }))];
}

