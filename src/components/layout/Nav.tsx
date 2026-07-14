"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useLenis } from "lenis/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Magnetic } from "@/components/ui/Magnetic";
import { BrasiliaClock } from "@/components/ui/BrasiliaClock";

const NAV_LINKS = [
  { href: "#work", key: "work" },
  { href: "#about", key: "about" },
  { href: "#contact", key: "contact" },
] as const;

export function Nav() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  useLenis((lenis) => {
    const scrollingDown = lenis.direction === 1;
    const pastThreshold = lenis.scroll > 120;
    setHidden(scrollingDown && pastThreshold);
  });

  function toggleLocale() {
    const nextLocale = locale === "pt" ? "en" : "pt";
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <header
      data-hidden={hidden}
      className="fixed inset-x-0 top-0 z-100 flex items-center justify-between px-6 py-5 transition-transform duration-500 ease-out data-[hidden=true]:-translate-y-full md:px-10"
    >
      <Magnetic strength={0.5}>
        <Link href="/" className="font-display text-xl text-text" data-cursor="hover">
          B.
        </Link>
      </Magnetic>

      <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-text-muted md:gap-8">
        {NAV_LINKS.map((link) => (
          <Magnetic key={link.key} strength={0.35}>
            <a href={link.href} data-cursor="hover" className="transition-colors hover:text-text">
              {t(link.key)}
            </a>
          </Magnetic>
        ))}

        <Magnetic strength={0.35}>
          <button
            type="button"
            onClick={toggleLocale}
            data-cursor="hover"
            className="transition-colors hover:text-text"
          >
            {locale === "pt" ? "EN" : "PT"}
          </button>
        </Magnetic>

        <span className="hidden sm:inline-flex">
          <BrasiliaClock />
        </span>
      </nav>
    </header>
  );
}
