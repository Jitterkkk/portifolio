import { useTranslations } from "next-intl";

export function Work() {
  const t = useTranslations("Work");

  return (
    <section
      id="work"
      className="flex min-h-screen flex-col justify-center gap-4 border-t border-border px-6 md:px-10"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-text-muted">01</span>
      <h2 className="text-section-title font-display text-text">{t("title")}</h2>
      <p className="max-w-md font-body text-text-muted">{t("description")}</p>
    </section>
  );
}
