import { getSiteContent, listPortfolioServices } from "@/db/repository";
import { services } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const [content, liveServices] = await Promise.all([getSiteContent(), listPortfolioServices(services)]);
  const base = (content.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://orkobiswas.com").replace(/\/$/, "");
  const links = content.profileLinks.filter((link) => link.enabled && link.url).map((link) => `- ${link.label}: ${link.url}`);
  const body = [`# ${content.name}`, "", `> ${content.aeoSummary}`, "", "## Expertise", ...content.expertiseAreas.split(",").map((item) => `- ${item.trim()}`).filter((item) => item !== "-"), "", "## Services", ...liveServices.map((service) => `- [${service.title}](${base}/services/${service.slug}): ${service.promise}`), "", "## Portfolio", `- [Selected work](${base}/work)`, `- [About](${base}/about)`, `- [Contact](${base}/contact)`, "", ...(links.length ? ["## Verified public profiles", ...links, ""] : []), `Service area: ${content.serviceArea}`, `Contact: ${content.email}`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
