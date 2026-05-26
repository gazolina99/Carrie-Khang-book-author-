/**
 * Optional: run DB migrations + seed when the Node server boots.
 * - Netlify sets NETLIFY=1 automatically.
 * - Other hosts: set RUN_DB_SETUP_ON_BOOT=1, or run migrate/seed via the host’s release step (often safer).
 */
export async function register() {
  const runOnBoot =
    process.env.RUN_DB_SETUP_ON_BOOT === "1" || Boolean(process.env.NETLIFY);
  if (!runOnBoot) return;

  if (!process.env.DATABASE_URL) {
    console.warn("[setup] DATABASE_URL is missing — run npm run setup or add .env.");
    return;
  }

  try {
    const { execSync } = await import("child_process");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    execSync("npx prisma db seed", { stdio: "inherit" });
  } catch (err) {
    console.error("[setup] Database setup failed:", err);
  }
}
