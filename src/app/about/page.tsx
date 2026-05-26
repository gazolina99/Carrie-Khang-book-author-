import type { Metadata } from "next";
import { getSiteSettingsSafe } from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "About" };
}

export default async function AboutPage() {
  const settings = await getSiteSettingsSafe();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-4xl font-medium text-ink md:text-5xl">
        About {settings.siteName}
      </h1>
      <div className="prose-author mt-10 max-w-none whitespace-pre-wrap text-xl leading-relaxed text-ink-muted">
        {settings.aboutBody}
      </div>
    </div>
  );
}
