import type { Metadata } from "next";
/* eslint-disable @next/next/next-script-for-ga -- The Vinext worker loads an optional owner-configured GTM ID without adding a browser package. */
import { headers } from "next/headers";
import "./globals.css";
import { AppFrame } from "@/components/AppFrame";
import { getSiteContent, listPortfolioServices } from "@/db/repository";
import { services } from "@/lib/portfolio";
import type { SiteContent } from "@/lib/site-content";

async function siteOrigin(content: SiteContent) {
  if (content.canonicalUrl) return content.canonicalUrl.replace(/\/$/, "");
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "orkobiswas.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return (process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`).replace(/\/$/, "");
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const origin = await siteOrigin(content);
  const shareImage = content.socialImageUrl ? [{ url: content.socialImageUrl, alt: `${content.name} — ${content.shortTitle}` }] : undefined;
  return {
    metadataBase: new URL(origin),
    title: { default: content.seoTitle, template: `%s — ${content.name}` },
    description: content.seoDescription,
    applicationName: `${content.name} Portfolio`,
    authors: [{ name: content.name }],
    creator: content.name,
    keywords: content.seoKeywords.split(",").map((item) => item.trim()).filter(Boolean),
    icons: content.faviconUrl ? { icon: content.faviconUrl, shortcut: content.faviconUrl, apple: content.faviconUrl } : undefined,
    openGraph: { type: "website", title: content.seoTitle, description: content.seoDescription, siteName: `${content.name} Portfolio`, images: shareImage },
    twitter: { card: "summary_large_image", title: content.seoTitle, description: content.seoDescription, images: content.socialImageUrl ? [content.socialImageUrl] : undefined },
    robots: { index: content.searchIndexing, follow: content.searchIndexing },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [content, liveServices] = await Promise.all([getSiteContent(), listPortfolioServices(services)]);
  const origin = await siteOrigin(content);
  const legacyProfiles = [content.instagram, content.linkedin, content.behance].filter((url) => {
    if (!url) return false;
    try { return new URL(url).pathname !== "/"; } catch { return false; }
  });
  const publicLinks = [...new Set([...content.profileLinks.filter((link) => link.enabled && link.url).map((link) => link.url), ...legacyProfiles])];
  const knowsAbout = content.expertiseAreas.split(",").map((item) => item.trim()).filter(Boolean);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${origin}/#website`, url: origin, name: `${content.name} Portfolio`, description: content.seoDescription, inLanguage: content.siteLanguage, creator: { "@id": `${origin}/#person` } },
      { "@type": ["Person", "ProfessionalService"], "@id": `${origin}/#person`, name: content.name, url: origin, logo: content.logoUrl || undefined, image: content.socialImageUrl || undefined, jobTitle: content.title, description: content.aeoSummary, email: content.email, areaServed: content.serviceArea, address: content.location, knowsAbout, sameAs: publicLinks, slogan: content.headline },
      { "@type": "ItemList", "@id": `${origin}/#services`, name: `${content.name} services`, itemListElement: liveServices.map((service, index) => ({ "@type": "ListItem", position: index + 1, url: `${origin}/services/${service.slug}`, name: service.title, description: service.promise })) },
    ],
  };
  const gtmId = content.gtmContainerId;
  return (
    <html lang={content.siteLanguage} style={{ "--website-logo-width": `${content.logoWidth}px`, "--website-logo-height": `${content.logoHeight}px` } as React.CSSProperties}>
      <body style={{ "--accent": content.themeColor } as React.CSSProperties}>
        {gtmId && <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');` }} />}
        {gtmId && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript>}
        <a className="skip-link" href="#main-content">Skip to content</a>
        <AppFrame content={content}>{children}</AppFrame>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />
      </body>
    </html>
  );
}
