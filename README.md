# Carrie Khang — Author website

Clone → install → setup → dev. No Postgres required for local use.

## Run it (3 commands)

```bash
gh repo clone gazolina99/Carrie-Khang-book-author-
cd Carrie-Khang-book-author-
npm install
npm run setup
npm run dev
```

Open **http://localhost:3000**

**Sign in:** http://localhost:3000/login  
Email: `author@example.com` · Password: `change-me-on-first-login`

`npm run setup` creates `.env`, applies the database, and seeds the admin user.

---

## Deploy online

Use any host with **Node 20** (Railway, Render, Fly.io, a VPS, etc.).

1. Connect this GitHub repo to the host.
2. **Build:** `npm run build` · **Start:** `npm run start`
3. Set env vars (see [DEPLOY-ENV-VARS.txt](DEPLOY-ENV-VARS.txt)):
   - `DATABASE_URL` — use `file:./dev.db` on a single server with a **persistent disk**, or Postgres if you prefer
   - `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` — your public `https://…` URL
4. Before first boot (or on each deploy): `npx prisma migrate deploy && npm run db:seed`  
   Or set `RUN_DB_SETUP_ON_BOOT=1` to run that automatically.

**CI:** pushes to `master` / `main` run [.github/workflows/ci.yml](.github/workflows/ci.yml).

---

## Optional: Netlify

`netlify.toml` is included but not required. SQLite + serverless is a poor fit; use a Node host with persistent storage instead.
