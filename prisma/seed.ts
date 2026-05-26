import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "author@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "change-me-on-first-login";

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name: "Carrie Khang",
    },
    update: {},
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      siteName: "Carrie Khang",
      tagline: "Author",
      heroTitle: "Stories that stay with you",
      heroSubtitle:
        "Welcome to my corner of the web. Explore books, news, and reader notes.",
      aboutBody:
        "I write fiction with heart. Use the dashboard to replace this text, upload covers, and connect your store links.",
      footerNote: "© Carrie Khang. All rights reserved.",
    },
    update: {},
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
