"use client";

import { useTranslations } from "next-intl";
import type { Project } from "@/data/projects";

type WorkRowProps = {
  project: Project;
  onHoverChange: (hovering: boolean) => void;
};

export function WorkRow({ project, onHoverChange }: WorkRowProps) {
  const t = useTranslations("Work");
  const href = project.links.live ?? project.links.repo;

  const content = (
    <>
      <span className="w-10 shrink-0 font-mono text-sm text-text-muted transition-colors duration-300 group-hover:text-ember md:w-14">
        {project.index}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[clamp(1.75rem,5vw,3.75rem)] text-text transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:text-ember">
          {t(`projects.${project.slug}.title`)}
        </span>
        <span className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-editorial border border-border px-2 py-1">
              {tech}
            </span>
          ))}
        </span>
      </span>

      <span className="hidden shrink-0 flex-col items-end gap-1 text-right font-mono text-xs uppercase tracking-widest text-text-muted sm:flex">
        <span>
          {project.year} · {project.role}
        </span>
        {project.statusKey === "inDevelopment" ? (
          <span className="text-ember">{t("statusInDevelopment")}</span>
        ) : null}
      </span>
    </>
  );

  const sharedClassName =
    "group flex w-full items-center gap-4 border-b border-border py-8 text-left md:gap-6 md:py-10";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="view"
        data-cursor-label={t("cursorView")}
        className={sharedClassName}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={sharedClassName}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {content}
    </div>
  );
}
