import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.branch.createMany({
    data: [
      {
        name: "Ansal Plaza",
        address: "Ansal Plaza, Ludhiana",
        phone: "9876543210",
      },
      {
        name: "Sector 32",
        address: "Sector 32, Ludhiana",
        phone: "9876543211",
      },
      {
        name: "BRS Nagar",
        address: "BRS Nagar, Ludhiana",
        phone: "9876543212",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Branches seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
