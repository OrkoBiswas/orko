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

      const heroMedia = document.querySelector<HTMLElement>("[data-hero-media]");
      if (heroMedia) {
        gsap.fromTo(
          heroMedia,
          { autoAlpha: 0, scale: 1.06, xPercent: 5 },
          { autoAlpha: 1, scale: 1, xPercent: 0, duration: 1.35, ease: "power4.out", delay: 0.12 },
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

      const processSequence = document.querySelector<HTMLElement>("[data-process-sequence]");
      if (processSequence) {
        const heading = processSequence.querySelector<HTMLElement>(".section-heading");
        const stage = processSequence.querySelector<HTMLElement>("[data-process-stage]");
        const nodes = gsap.utils.toArray<HTMLElement>("[data-process-node]", processSequence);
        const entries = gsap.utils.toArray<HTMLElement>("[data-process-entry]", processSequence);
        const details = gsap.utils.toArray<HTMLElement>("[data-process-detail]", processSequence);
        const progress = processSequence.querySelector<HTMLElement>("[data-process-progress]");
        const sequence = gsap.timeline({
          scrollTrigger: {
            trigger: processSequence,
            start: "top 86%",
            end: "top 34%",
            scrub: 0.75,
          },
        });

        if (heading) sequence.fromTo(heading, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0);
        if (stage) sequence.fromTo(stage, { y: 34, scale: 0.975 }, { y: 0, scale: 1, duration: 0.72, ease: "power3.out" }, 0.06);
        if (progress) sequence.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1.35, ease: "none" }, 0.1);
        if (nodes.length) sequence.fromTo(nodes, { scale: 0.35, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.28, stagger: 0.14, ease: "back.out(2.2)" }, 0.13);
        if (entries.length) sequence.fromTo(entries, { y: (index) => index % 2 === 0 ? -32 : 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.11, ease: "power3.out" }, 0.2);
        if (details.length) sequence.fromTo(details, { x: -10, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, stagger: 0.08, ease: "power2.out" }, 0.48);
      }
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [pathname]);

  return null;
}
