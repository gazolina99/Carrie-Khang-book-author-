import { copyFileSync, existsSync } from "fs";
import { execSync } from "child_process";

if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("Created .env from .env.example");
}

execSync("npx prisma migrate deploy", { stdio: "inherit" });
execSync("npm run db:seed", { stdio: "inherit" });

console.log("");
console.log("Ready. Start the site:");
console.log("  npm run dev");
console.log("");
console.log("Get DATABASE_URL free at https://neon.tech (required for Vercel and local dev).");
console.log("Sign in at http://localhost:3000/login");
console.log("  Email:    author@example.com");
console.log("  Password: change-me-on-first-login");
