import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import type { SiteSettings } from "@prisma/client";
import { auth } from "@/auth";
import { SessionProvider } from "@/components/session-provider";
import { AdminDock } from "@/components/admin-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { defaultSiteSettings, getSiteSettingsSafe } from "@/lib/site-data";
import "./globals.css";

export const dynamic = "force-dynamic";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettingsSafe();
  return {
    title: {
      default: s.siteName,
      template: `%s · ${s.siteName}`,
    },
    description: s.heroSubtitle || s.tagline || "Author website",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: SiteSettings = await getSiteSettingsSafe();
  const session = await auth().catch(() => null);
  const accent = settings.accentHex || defaultSiteSettings.accentHex;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakarta.variable} h-full scroll-smooth`}
      style={
        {
          "--accent": accent,
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <SessionProvider session={session}>
          <SiteHeader settings={settings} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <AdminDock />
        </SessionProvider>
      </body>
    </html>
  );
}
