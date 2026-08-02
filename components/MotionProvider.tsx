"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionProvider() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    if (reduce) {
      document.documentElement.dataset.motion = "reduced";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      if (heroLines.length) {
        gsap.fromTo(
          heroLines,
          { yPercent: 105, rotate: 1.5 },
          { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.1, ease: "power4.out", delay: 0.1 },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } },
        );
      });

      const projectCards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
      if (projectCards.length) {
        gsap.set(projectCards, { y: 68, autoAlpha: 0, scale: 0.975, transformOrigin: "50% 100%" });
        ScrollTrigger.batch(projectCards, {
          start: "top 92%",
          once: true,
          interval: 0.08,
          batchMax: 4,
          onEnter: (elements) => gsap.to(elements, {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.05,
            stagger: 0.09,
            ease: "power4.out",
            overwrite: true,
          }),
        });
      }

      gsap.utils.toArray<HTMLElement>(".section-heading").forEach((heading) => {
        const rule = heading.querySelector<HTMLElement>(".eyebrow");
        if (!rule) return;
        gsap.fromTo(rule, { x: -20, opacity: 0 }, {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.9 },
        });
      });
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [pathname]);

  return null;
}
