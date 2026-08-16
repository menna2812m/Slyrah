import type { Metadata, Viewport } from "next";
import { DM_Mono, Fraunces, Hanken_Grotesk } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { ButterflyDefs } from "@/components/ui/butterfly";
import { RevealObserver } from "@/components/ui/reveal";
import { Toaster } from "@/components/ui/toast";
import { getCharacters, getStoreSettings } from "@/lib/api/server-data";
import { SITE_NAME, SITE_URL, organizationSchema, websiteSchema } from "@/lib/seo";
import "@/styles/globals.css";

/**
 * Fraunces carries the personality: an old-style with SOFT and WONK axes, set
 * with a little of both so headings have a hand-cut quality rather than the
 * high-contrast neutrality every fashion site reaches for. Hanken Grotesk is
 * the workhorse. DM Mono appears only on things that are compared to each
 * other — prices, sizes, SKUs, counters, countdowns.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Slyrah — underwear made in Egypt",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Egyptian cotton, ribbed modal, seamless microfibre and cotton-backed lace. Start with the woman whose day looks like yours. Cash on delivery across all 27 governorates.",
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F0F1" },
    { media: "(prefers-color-scheme: dark)", color: "#2B1F2E" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, characters] = await Promise.all([getStoreSettings(), getCharacters()]);

  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${hanken.variable} ${dmMono.variable}`}>
      <body>
        <ButterflyDefs />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-90 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2.5 focus:text-chalk"
        >
          Skip to content
        </a>

        <AnnouncementBar items={settings.announcements} intervalMs={settings.announcementIntervalMs} />
        <Header settings={settings} characters={characters} />

        <main id="main">{children}</main>

        <Footer settings={settings} />

        <Toaster />
        <RevealObserver />

        <JsonLd data={[organizationSchema(settings.contact), websiteSchema()]} />
      </body>
    </html>
  );
}
