import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { clashDisplay, satoshi, geistMono } from "@/lib/fonts";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { Nav } from "@/components/layout/Nav";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Preloader } from "@/components/layout/Preloader";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${clashDisplay.variable} ${satoshi.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-bg text-text antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LenisProvider>
            <Preloader />
            <GrainOverlay />
            <CustomCursor />
            <Nav />
            <main>{children}</main>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
