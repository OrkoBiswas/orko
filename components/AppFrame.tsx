"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SettingsDock } from "@/components/SettingsDock";
import { MotionProvider } from "@/components/MotionProvider";
import { CustomCursor } from "@/components/CustomCursor";
import type { SiteContent } from "@/lib/site-content";

export function AppFrame({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return <main id="main-content" className="admin-route-main">{children}</main>;
  }

  return (
    <>
      <div id="top" />
      <SiteHeader content={content} />
      <main id="main-content">{children}</main>
      <SiteFooter content={content} />
      <SettingsDock />
      <MotionProvider />
      <CustomCursor />
    </>
  );
}
