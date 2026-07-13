import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Aura Gym Admin",
      email: "admin@auragym.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created");
}

main();
