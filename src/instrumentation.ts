/**
 * On Netlify: run DB migrations + seed once the server starts.
 * No manual “npm run db:seed” needed if ADMIN_EMAIL / ADMIN_PASSWORD are set in Netlify.
 */
export async function register() {
  if (!process.env.NETLIFY) return;
  if (!process.env.DATABASE_URL) {
    console.warn("[setup] DATABASE_URL is missing — enable Netlify DB or add Postgres URL.");
    return;
  }

  try {
    const { execSync } = await import("child_process");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      execSync("npx prisma db seed", { stdio: "inherit" });
    }
  } catch (err) {
    console.error("[setup] Database setup failed:", err);
  }
}
