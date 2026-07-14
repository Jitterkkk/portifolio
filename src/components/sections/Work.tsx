"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP, gsap, SplitText } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { WorkRow } from "./work/WorkRow";
import { WorkPreview } from "./work/WorkPreview";

export function Work() {
  const t = useTranslations("Work");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const split = new SplitText(titleRef.current, { type: "lines", mask: "lines" });

      gsap.from(split.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      const rows = listRef.current ? Array.from(listRef.current.children) : [];
      gsap.from(rows, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
        },
      });

      return () => split.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-ember">
            {t("eyebrow")}
          </span>
          <h2 ref={titleRef} className="mt-4 text-section-title font-display text-text">
            {t("title")}
          </h2>
        </div>
        <span className="font-mono text-sm text-text-muted">
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      <div ref={listRef}>
        {projects.map((project, i) => (
          <WorkRow
            key={project.slug}
            project={project}
            onHoverChange={(hovering) => setHoveredIndex(hovering ? i : null)}
          />
        ))}
      </div>

      <WorkPreview active={hoveredIndex !== null} />
    </section>
  );
}
