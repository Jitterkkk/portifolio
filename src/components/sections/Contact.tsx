import { useTranslations } from "next-intl";

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col justify-center gap-4 border-t border-border px-6 pb-24 md:px-10"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-text-muted">03</span>
      <h2 className="text-section-title font-display text-text">{t("title")}</h2>
      <p className="max-w-md font-body text-text-muted">{t("description")}</p>
    </section>
  );
}
