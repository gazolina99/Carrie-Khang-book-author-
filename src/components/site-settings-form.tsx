"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@prisma/client";
import { updateSiteSettings } from "@/app/actions/settings";

const initial = undefined as { error?: string; ok?: boolean } | undefined;

const field =
  "mt-2 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(
    updateSiteSettings,
    initial,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-base font-semibold text-ink">
          Site name
          <input
            name="siteName"
            required
            defaultValue={settings.siteName}
            className={field}
          />
        </label>
        <label className="block text-base font-semibold text-ink">
          Tagline
          <input name="tagline" defaultValue={settings.tagline} className={field} />
        </label>
      </div>
      <label className="block text-base font-semibold text-ink">
        Accent color (hex)
        <input name="accentHex" defaultValue={settings.accentHex} className={field} />
      </label>
      <label className="block text-base font-semibold text-ink">
        Home hero title
        <input name="heroTitle" defaultValue={settings.heroTitle} className={field} />
      </label>
      <label className="block text-base font-semibold text-ink">
        Home hero subtitle
        <textarea
          name="heroSubtitle"
          rows={3}
          defaultValue={settings.heroSubtitle}
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        About page (full text)
        <textarea
          name="aboutBody"
          rows={10}
          defaultValue={settings.aboutBody}
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Footer note
        <textarea
          name="footerNote"
          rows={2}
          defaultValue={settings.footerNote}
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Public contact email
        <input
          name="contactEmailPublic"
          type="email"
          defaultValue={settings.contactEmailPublic}
          className={field}
        />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-base font-semibold text-ink">
          Twitter / X URL
          <input name="twitterUrl" defaultValue={settings.twitterUrl} className={field} />
        </label>
        <label className="block text-base font-semibold text-ink">
          Instagram URL
          <input
            name="instagramUrl"
            defaultValue={settings.instagramUrl}
            className={field}
          />
        </label>
      </div>
      <label className="block text-base font-semibold text-ink">
        Goodreads URL
        <input name="goodreadsUrl" defaultValue={settings.goodreadsUrl} className={field} />
      </label>
      <label className="block text-base font-semibold text-ink">
        WordPress blog URL (for embed)
        <input
          name="wordpressBlogUrl"
          defaultValue={settings.wordpressBlogUrl}
          placeholder="https://yourblog.wordpress.com"
          className={field}
        />
      </label>
      <hr className="border-line" />
      <p className="text-base font-semibold text-ink">
        Newsletter sender identity
      </p>
      <label className="block text-base font-semibold text-ink">
        From email (must match a verified domain in Resend)
        <input
          name="newsletterFromEmail"
          type="email"
          defaultValue={settings.newsletterFromEmail}
          placeholder="newsletter@yourdomain.com"
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Reply-to (optional)
        <input
          name="newsletterReplyTo"
          type="email"
          defaultValue={settings.newsletterReplyTo}
          className={field}
        />
      </label>
      {state?.error ? (
        <p className="text-base text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-base font-medium text-sky-deep">Settings saved.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save site settings"}
      </button>
    </form>
  );
}
