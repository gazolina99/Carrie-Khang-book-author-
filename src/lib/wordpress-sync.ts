type WpBookInput = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
};

function wpSyncConfig() {
  const baseUrl = process.env.WP_SYNC_BASE_URL?.trim();
  const username = process.env.WP_SYNC_USERNAME?.trim();
  const appPassword = process.env.WP_SYNC_APP_PASSWORD?.trim();
  if (!baseUrl || !username || !appPassword) return null;
  return { baseUrl: baseUrl.replace(/\/+$/, ""), username, appPassword };
}

function wpHeaders(username: string, appPassword: string) {
  const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");
  return {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };
}

export async function upsertWordpressBook(input: WpBookInput): Promise<void> {
  const cfg = wpSyncConfig();
  if (!cfg) return;
  const slug = `book-${input.id}`;
  const headers = wpHeaders(cfg.username, cfg.appPassword);

  const existingRes = await fetch(
    `${cfg.baseUrl}/wp-json/wp/v2/ck_book?slug=${encodeURIComponent(slug)}&_fields=id`,
    { method: "GET", headers, cache: "no-store" },
  );
  if (!existingRes.ok) {
    throw new Error(`WP lookup failed (${existingRes.status})`);
  }
  const existing = (await existingRes.json()) as Array<{ id: number }>;
  const id = existing[0]?.id;

  const body = JSON.stringify({
    title: input.title,
    content: input.description,
    status: input.published ? "publish" : "draft",
    menu_order: input.sortOrder,
    slug,
  });

  const endpoint = id
    ? `${cfg.baseUrl}/wp-json/wp/v2/ck_book/${id}`
    : `${cfg.baseUrl}/wp-json/wp/v2/ck_book`;
  const saveRes = await fetch(endpoint, { method: id ? "POST" : "POST", headers, body });
  if (!saveRes.ok) {
    throw new Error(`WP save failed (${saveRes.status})`);
  }
}

export async function syncWordpressReviewApproval(
  localReviewId: string,
  approved: boolean,
): Promise<void> {
  const cfg = wpSyncConfig();
  if (!cfg) return;
  const slug = `review-${localReviewId}`;
  const headers = wpHeaders(cfg.username, cfg.appPassword);
  const existingRes = await fetch(
    `${cfg.baseUrl}/wp-json/wp/v2/ck_review?slug=${encodeURIComponent(slug)}&_fields=id,status`,
    { method: "GET", headers, cache: "no-store" },
  );
  if (!existingRes.ok) return;
  const existing = (await existingRes.json()) as Array<{ id: number }>;
  const id = existing[0]?.id;
  if (!id) return;

  await fetch(`${cfg.baseUrl}/wp-json/wp/v2/ck_review/${id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ status: approved ? "publish" : "draft" }),
  });
}
