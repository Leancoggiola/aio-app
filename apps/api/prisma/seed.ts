import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 12;

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.log(
      "⚠️  ADMIN_USERNAME and ADMIN_PASSWORD env vars not set. Skipping admin seed.",
    );
    await prisma.$disconnect();
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (existing) {
    console.log("✅ Admin user already exists. Skipping.");
    await prisma.$disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created successfully.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
