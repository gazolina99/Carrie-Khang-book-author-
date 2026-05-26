import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { auth } from "@/auth";
import { SessionProvider } from "@/components/session-provider";
import { AdminDock } from "@/components/admin-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/settings";
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
  let s = defaultSettings;
  try {
    s = await getSiteSettings();
  } catch {
    /* ok */
  }
  return {
    title: {
      default: s.siteName,
      template: `%s · ${s.siteName}`,
    },
    description: s.heroSubtitle || s.tagline || "Author website",
  };
}

import type { SiteSettings } from "@prisma/client";

const defaultSettings: SiteSettings = {
  id: "singleton",
  siteName: "Carrie Khang",
  tagline: "",
  heroTitle: "",
  heroSubtitle: "",
  accentHex: "#8aa8cf",
  aboutBody: "",
  footerNote: "",
  contactEmailPublic: "",
  twitterUrl: "",
  instagramUrl: "",
  goodreadsUrl: "",
  newsletterFromEmail: "",
  newsletterReplyTo: "",
  wordpressBlogUrl: "",
  updatedAt: new Date(0),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings: SiteSettings = defaultSettings;
  try {
    settings = await getSiteSettings();
  } catch {
    /* database not ready — child pages show setup help */
  }
  const session = await auth().catch(() => null);
  const accent = settings.accentHex || "#8aa8cf";

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
