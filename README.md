# Carrie Khang — Author website

Next.js author site with a public marketing area and a password-protected **dashboard**. Source of truth is **this GitHub repo**; production is any host that runs **Node 20**, **PostgreSQL**, and environment variables listed below.

**CI:** every push to `main` / `master` runs [.github/workflows/ci.yml](.github/workflows/ci.yml) (`npm ci` → `npm run build`).

---

## Local development

1. Clone from GitHub and install dependencies:

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   npm install
   ```

2. Create `.env` from [.env.example](.env.example) and set at least `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, and `NEXT_PUBLIC_SITE_URL` (for localhost you can use `http://localhost:3000` for both).

3. Apply migrations and seed (creates admin user):

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

---

## Deploy (pick any host)

You need:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Long random secret (NextAuth) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First login; also used by `prisma db seed` |
| `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` | Full public URL, e.g. `https://yoursite.com` (some platforms set these for you) |

**Build:** `npm run build` — **Start:** `npm run start`

**Before first boot in production:**

```bash
npx prisma migrate deploy
npm run db:seed
```

Or enable automatic migrate + seed on server start:

- **Netlify:** sets `NETLIFY=1` automatically; instrumentation runs migrations + seed when `DATABASE_URL` is set.
- **Other hosts:** set `RUN_DB_SETUP_ON_BOOT=1` **or** use the host’s “release command” / one-off shell to run `prisma migrate deploy` and `db:seed`.

**Book covers:** On hosts without Netlify Blobs, covers save to disk under `public/uploads/books/` (use a persistent volume on your platform).

See [DEPLOY-ENV-VARS.txt](DEPLOY-ENV-VARS.txt) for a copy-paste checklist.

---

## Optional: Netlify

`netlify.toml` is included for teams that still use Netlify; it is not required for development or CI.
