# Carrie Khang — Author website

## NOT VERCEL — use Netlify only

If you see “Deploy to Vercel”, you are on the wrong host or the site failed to build.
This project is built for **Netlify** + **Netlify DB**.

---

## Easiest setup (about 10 minutes)

### 1. Put code on GitHub

- Create a repo on GitHub
- Upload this whole folder (or push with GitHub Desktop)

### 2. Connect Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project** → **GitHub**
3. Pick your repo
4. Netlify reads `netlify.toml` automatically — click **Deploy** (it may fail once — that’s OK)

### 3. Turn on the database

1. In your site: **Extensions** → **Netlify DB** → **Install** / **Enable**
2. Netlify adds `DATABASE_URL` for you

### 4. Add 3 environment variables

**Site configuration** → **Environment variables** → **Add a variable**

| Name | Value |
|------|--------|
| `AUTH_SECRET` | Any long random string (e.g. 40 letters/numbers) |
| `ADMIN_EMAIL` | Email Carrie uses to sign in |
| `ADMIN_PASSWORD` | Password Carrie uses to sign in |

You do **not** need to set `AUTH_URL` — Netlify sets the site URL automatically.

### 5. Deploy again

**Deploys** → **Trigger deploy** → **Deploy site**

Wait until it says **Published**.

### 6. Open the site

- Public site: `https://YOUR-SITE-NAME.netlify.app`
- Author login: same URL + `/login` or **Author sign in** (bottom-right)

---

## Do not

- Do **not** deploy on Vercel
- Do **not** drag-and-drop a zip on Netlify (use GitHub import)
- Do **not** skip Netlify DB (the site needs a database)

---

## Local test (optional)

```bash
npm install
npm run dev
```

You need a Postgres URL in `.env` (Neon free tier or Netlify DB connection string).
