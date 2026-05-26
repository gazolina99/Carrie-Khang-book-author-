import { PasswordChangeForm } from "@/components/password-change-form";
import { SiteSettingsForm } from "@/components/site-settings-form";
import { getSiteSettings } from "@/lib/settings";

export default async function DashboardSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Site settings
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Branding, gentle colors, copy for parents, social links, WordPress embed,
        and newsletter sender details—all here.
      </p>
      <div className="mt-10">
        <SiteSettingsForm settings={settings} />
      </div>
      <PasswordChangeForm />
    </div>
  );
}
