import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { brand } from "@/lib/brand";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionProvider } from "@/components/MotionProvider";
import { SettingsDock } from "@/components/SettingsDock";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "orkobiswas.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: { default: `${brand.name} — ${brand.shortTitle}`, template: `%s — ${brand.name}` },
    description: brand.intro,
    applicationName: `${brand.name} Portfolio`,
    authors: [{ name: brand.name }],
    creator: brand.name,
    keywords: ["Orko Biswas", "video editor", "motion designer", "graphic designer", "visual storyteller", "portfolio"],
    openGraph: {
      type: "website",
      title: `${brand.name} — Visual stories, built to move`,
      description: brand.intro,
      siteName: `${brand.name} Portfolio`,
      images: [{ url: "/og.png", width: 1734, height: 907, alt: `${brand.name} — video editor, motion designer, visual storyteller` }],
    },
    twitter: { card: "summary_large_image", title: `${brand.name} — Visual stories, built to move`, description: brand.intro, images: ["/og.png"] },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: brand.name,
    jobTitle: "Video Editor, Motion Designer and Graphic Designer",
    description: brand.intro,
    knowsAbout: ["Video editing", "2D motion graphics", "Graphic design", "Social media creative"],
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div id="top" />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <SettingsDock />
        <MotionProvider />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />
      </body>
    </html>
  );
}

