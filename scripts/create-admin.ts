import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingUser) {
    console.log("Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
