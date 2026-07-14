"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, SplitText } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/preloader-events";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

export function Hero() {
  const t = useTranslations("Hero");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let split: SplitText | null = null;

    function reveal() {
      if (!headingRef.current) return;

      split = new SplitText(headingRef.current, { type: "lines", mask: "lines" });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(split.lines, {
        yPercent: 110,
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
      });

      if (eyebrowRef.current) {
        tl.from(
          eyebrowRef.current,
          { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" },
          "-=0.7",
        );
      }
      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" },
          "-=0.6",
        );
      }
    }

    const off = onPreloaderDone(reveal);
    return () => {
      off();
      split?.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-bg px-6 pb-10 pt-32 md:px-10"
    >
      <HeroCanvas />

      <div
        ref={eyebrowRef}
        className="relative z-10 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-text-muted"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
        <span>{t("available")}</span>
        <span className="text-text-muted/50">/</span>
        <span>{t("location")}</span>
      </div>

      <div className="relative z-10">
        <h1 ref={headingRef} className="text-hero font-display text-text">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h1>

        <div
          ref={subtitleRef}
          className="mt-8 grid gap-2 font-body text-lg text-text-muted sm:grid-cols-2 sm:text-xl"
        >
          <span>{t("roleDev")}</span>
          <span>{t("roleDesign")}</span>
        </div>
      </div>

      <ScrollIndicator label={t("scrollHint")} />
    </section>
  );
}
